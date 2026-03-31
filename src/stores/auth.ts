import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/axios'

export interface AuthState {
  token: string | null
  email: string | null
  role: string | null
  userId: number | null
}

export interface RegisterPayload {
  email: string
  password: string
  phone: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

const STORAGE_KEY = 'auth'

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return { token: null, email: null, role: null, userId: null }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadFromStorage()

  const token = ref<string | null>(stored.token)
  const email = ref<string | null>(stored.email)
  const role = ref<string | null>(stored.role)
  const userId = ref<number | null>(stored.userId)

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

  function setAuth(data: { token: string; email: string; role: string; userId: number }) {
    token.value = data.token
    email.value = data.email
    role.value = data.role
    userId.value = data.userId
    persist()
  }

  async function register(payload: RegisterPayload) {
    const { data } = await apiClient.post('/api/auth/register', payload)
    setAuth(data)
    return data
  }

  async function login(payload: LoginPayload) {
    const { data } = await apiClient.post('/api/auth/login', payload)
    setAuth(data)
    return data
  }

  function logout() {
    token.value = null
    email.value = null
    role.value = null
    userId.value = null
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('token')
  }

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isSitter = computed(() => role.value === 'SITTER')
  const isUser = computed(() => role.value === 'USER')

  function getDashboardRoute(): string {
    if (role.value === 'ADMIN') return '/dashboard/admin'
    if (role.value === 'SITTER') return '/dashboard/sitter'
    return '/dashboard/owner'
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
    logout,
    getDashboardRoute,
  }
})
