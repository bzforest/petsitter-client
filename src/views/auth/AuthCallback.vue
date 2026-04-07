<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/stores/auth'
import GoogleLoginSuccessModal from '@/components/auth/GoogleLoginSuccessModal.vue'
import GoogleRoleMismatchModal from '@/components/auth/GoogleRoleMismatchModal.vue'

/**
 * หน้านี้ทำหน้าที่รับ callback จาก Google OAuth และ handle 3 กรณี:
 *
 * Case 1 — SUCCESS (user ใหม่ หรือ user เก่าที่เลือก role ถูกต้อง)
 *   → แสดง GoogleLoginSuccessModal พร้อม countdown 3 วินาที
 *   → redirect ไปหน้า dashboard ตาม role
 *
 * Case 2 — ROLE MISMATCH (user เก่าที่เลือก role ผิด)
 *   → ล้าง token ทั้งหมดออกจาก localStorage และ Supabase session
 *   → แสดง GoogleRoleMismatchModal บอก user ว่า role จริงคืออะไร
 *   → user กด "Try Again" → redirect ไปหน้า /login
 *
 * Case 3 — GENERAL ERROR (token ไม่ถูกต้อง, session หมดอายุ, ฯลฯ)
 *   → แสดง error message พร้อมปุ่มกลับหน้า Login
 */

const router = useRouter()
const authStore = useAuthStore()

// State สำหรับ loading
const isLoading = ref(true)

// Case 1: success modal
const showSuccessModal = ref(false)
const successEmail = ref('')
const successRole = ref<Role>('USER')

// Case 2: role mismatch modal
const showMismatchModal = ref(false)
const mismatchAccountRole = ref<Role>('USER')   // role จริงใน DB
const mismatchSelectedRole = ref<Role>('USER')  // role ที่ user เลือก (ผิด)

// Case 3: general error
const errorMessage = ref('')

onMounted(async () => {
  try {
    // Supabase client อ่าน URL fragment (#access_token=...) และสร้าง session อัตโนมัติ
    const { data, error } = await supabase.auth.getSession()

    if (error) throw new Error(error.message)
    if (!data.session) throw new Error('No session found. Google login may have failed.')

    // Exchange Supabase token → JWT ของเรา
    const authData = await authStore.googleLogin(data.session.access_token)

    // Case 1: SUCCESS → แสดง success modal
    successEmail.value = authData.email
    successRole.value = authData.role
    showSuccessModal.value = true

  } catch (err: unknown) {
    const axiosError = err as any
    const status = axiosError?.response?.status
    const responseData = axiosError?.response?.data

    if (status === 409 && responseData?.code === 'ROLE_MISMATCH') {
      // Case 2: ROLE MISMATCH
      // ล้าง token ทั้งหมด — ทั้ง JWT ของเราและ Supabase session
      // เพราะ user ไม่ควรมี session ค้างอยู่หลังจาก login ไม่สำเร็จ
      await authStore.logout()

      // อ่าน role ที่ user เลือก (ยังอยู่ใน localStorage ถ้า googleLogin() throw ก่อนจะลบ)
      const selected = (localStorage.getItem('google_oauth_intended_role') as Role | null) ?? 'USER'
      localStorage.removeItem('google_oauth_intended_role')

      mismatchAccountRole.value = responseData.accountRole as Role
      mismatchSelectedRole.value = selected
      showMismatchModal.value = true

    } else {
      // Case 3: GENERAL ERROR
      errorMessage.value = responseData?.message
        ?? (err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
})

function handleProceed() {
  router.push(authStore.getDashboardRoute())
}

function handleTryAgain() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">

    <!-- Loading -->
    <div v-if="isLoading" class="text-center">
      <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p class="text-gray-600 text-lg font-medium">Signing in with Google...</p>
      <p class="text-gray-400 text-sm mt-2">Please wait a moment</p>
    </div>

    <!-- Case 3: General error -->
    <div
      v-if="!isLoading && errorMessage"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full mx-4 text-center"
    >
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Login Failed</h2>
      <p class="text-gray-500 text-sm mb-6">{{ errorMessage }}</p>
      <button
        @click="$router.push('/login')"
        class="w-full bg-orange-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-orange-600 transition-colors"
      >
        Back to Login
      </button>
    </div>

  </div>

  <!-- Case 1: Success modal -->
  <GoogleLoginSuccessModal
    v-if="showSuccessModal"
    :email="successEmail"
    :role="successRole"
    @proceed="handleProceed"
  />

  <!-- Case 2: Role mismatch modal -->
  <GoogleRoleMismatchModal
    v-if="showMismatchModal"
    :account-role="mismatchAccountRole"
    :selected-role="mismatchSelectedRole"
    @try-again="handleTryAgain"
  />
</template>
