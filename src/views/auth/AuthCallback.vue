<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

/**
 * หน้านี้ทำหน้าที่รับ callback จาก Google OAuth
 *
 * Flow:
 * 1. Google redirect กลับมาที่ /auth/callback พร้อม URL fragment เช่น
 *    http://localhost:5173/auth/callback#access_token=xxx&token_type=bearer&...
 * 2. Supabase client อ่าน fragment นั้นโดยอัตโนมัติและสร้าง session
 * 3. เราดึง session.access_token แล้วส่งไปที่ backend เพื่อ exchange เป็น JWT ของเรา
 * 4. เมื่อได้ JWT แล้ว redirect ไปที่ dashboard
 */

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

onMounted(async () => {
  try {
    // รอให้ Supabase client อ่าน URL fragment และสร้าง session
    // getSession() จะคืน session ที่มีอยู่หรือ null
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    if (!data.session) {
      throw new Error('No session found. Google login may have failed.')
    }

    // ส่ง Supabase access_token ไปที่ backend เพื่อ verify และ exchange เป็น JWT ของเรา
    await authStore.googleLogin(data.session.access_token)

    // redirect ไปที่ dashboard ตาม role
    router.push(authStore.getDashboardRoute())

  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Something went wrong. Please try again.'
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="!errorMessage">
        <!-- Loading spinner -->
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p class="text-gray-600 text-lg font-medium">กำลังเข้าสู่ระบบด้วย Google...</p>
        <p class="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
        <p class="text-gray-500 text-sm mb-6">{{ errorMessage }}</p>
        <button
          @click="$router.push('/login')"
          class="w-full bg-orange-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          กลับไปหน้า Login
        </button>
      </div>
    </div>
  </div>
</template>
