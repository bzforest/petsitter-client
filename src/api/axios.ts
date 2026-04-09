import axios from 'axios'
import router from '@/router'

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

// Response interceptor: on 401 → logout and redirect to /login
// Dynamic import ใช้เพื่อหลีกเลี่ยง circular dependency (auth.ts import apiClient อยู่แล้ว)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()
      await authStore.logout()
      await router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default apiClient
