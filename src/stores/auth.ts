import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/axios'
import { supabase } from '@/lib/supabase'

export type Role = 'ADMIN' | 'SITTER' | 'USER'

export interface AuthState {
  token: string | null
  email: string | null
  role: Role | null
  userId: number | null
}

export interface RegisterPayload {
  email: string
  password: string
  phone: string
  role: Exclude<Role, 'ADMIN'>
}

export interface LoginPayload {
  email: string
  password: string
}

const STORAGE_KEY = 'auth'
const EMPTY_AUTH_STATE: AuthState = { token: null, email: null, role: null, userId: null }
const VALID_ROLES: Role[] = ['ADMIN', 'SITTER', 'USER']

interface AuthResponse {
  token: string
  email: string
  role: Role
  userId: number
}

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && VALID_ROLES.includes(value as Role)
}

function parseAuthResponse(data: unknown): AuthResponse | null {
  if (!data || typeof data !== 'object') return null

  const parsed = data as Record<string, unknown>
  if (
    typeof parsed.token !== 'string' ||
    typeof parsed.email !== 'string' ||
    !isRole(parsed.role) ||
    typeof parsed.userId !== 'number'
  ) {
    return null
  }

  return {
    token: parsed.token,
    email: parsed.email,
    role: parsed.role,
    userId: parsed.userId,
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = parseAuthResponse(JSON.parse(raw))
      if (parsed) return parsed
    }
  } catch {
    // ignore parse errors
  }
  return EMPTY_AUTH_STATE
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadFromStorage()

  const token = ref<string | null>(stored.token)
  const email = ref<string | null>(stored.email)
  const role = ref<Role | null>(stored.role)
  const userId = ref<number | null>(stored.userId)

  /** ล้าง Pinia + localStorage แบบ sync — ใช้ร่วมกับ logout และกรณี token หมดอายุตอน init */
  function clearLocalAuthState() {
    token.value = null
    email.value = null
    role.value = null
    userId.value = null
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('token')
  }

  async function logout() {
    clearLocalAuthState()
    await supabase.auth.signOut()
  }

  // เปิดแอป/รีเฟรชแล้ว token ใน storage หมดอายุแล้ว → ล้างทันที (เส้นทางเดียวกับ logout)
  if (stored.token && isTokenExpired(stored.token)) {
    void logout()
  }

  function persist() {
    const state: AuthState = {
      token: token.value,
      email: email.value,
      role: role.value,
      userId: userId.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    if (token.value) {
      localStorage.setItem('token', token.value)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setAuth(data: AuthResponse) {
    token.value = data.token
    email.value = data.email
    role.value = data.role
    userId.value = data.userId
    persist()
  }

  async function register(payload: RegisterPayload) {
    const { data } = await apiClient.post('/api/auth/register', payload)
    const parsed = parseAuthResponse(data)
    if (!parsed) throw new Error('Invalid register response')
    return parsed
  }

  async function login(payload: LoginPayload) {
    const { data } = await apiClient.post('/api/auth/login', payload)
    const parsed = parseAuthResponse(data)
    if (!parsed) throw new Error('Invalid login response')
    setAuth(parsed)
    return parsed
  }

// Google OAuth login
  async function loginWithGoogle(intendedRole: Exclude<Role, 'ADMIN'> = 'USER') {
    localStorage.setItem('google_oauth_intended_role', intendedRole)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      localStorage.removeItem('google_oauth_intended_role')
      throw new Error(error.message)
    }
  }

  /**
   * Exchange Supabase access_token เป็น JWT ของเรา
   * เรียกจาก AuthCallback.vue หลัง Google redirect กลับมา
   * อ่าน intendedRole จาก localStorage แล้วส่งไปให้ backend
   */
  async function googleLogin(supabaseAccessToken: string) {
    const intendedRole = (localStorage.getItem('google_oauth_intended_role') as Exclude<Role, 'ADMIN'> | null) ?? 'USER'
    localStorage.removeItem('google_oauth_intended_role')

    const { data } = await apiClient.post('/api/auth/google', {
      accessToken: supabaseAccessToken,
      intendedRole,
    })
    const parsed = parseAuthResponse(data)
    if (!parsed) throw new Error('Invalid google login response')
    setAuth(parsed)
    return parsed
  }

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!role.value && !isTokenExpired(token.value))
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isSitter = computed(() => role.value === 'SITTER')
  const isUser = computed(() => role.value === 'USER')

  function getDashboardRoute(): string {
    if (role.value === 'ADMIN') return '/admin/pet-owners'
    if (role.value === 'SITTER') return '/sitterprofile'
    if (role.value === 'USER') return '/'
    return '/login'
  }

  return {
    token,
    email,
    role,
    userId,
    isLoggedIn,
    isAdmin,
    isSitter,
    isUser,
    register,
    login,
    loginWithGoogle,
    googleLogin,
    logout,
    getDashboardRoute,
  }
})
