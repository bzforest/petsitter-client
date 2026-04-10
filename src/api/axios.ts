import axios from 'axios'
import router from '@/router'
import { supabase } from '@/lib/supabase'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Bearer token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: on 401 → clear auth state and redirect to /login
// Inline logout to avoid circular dependency (auth.ts already imports apiClient)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')
      localStorage.removeItem('token')
      await supabase.auth.signOut()
      await router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default apiClient
