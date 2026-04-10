<script setup lang="ts">
import { ref } from 'vue'

/**
 * Modal สำหรับให้ user เลือก role ก่อน sign in ด้วย Google
 * แสดงขึ้นมาเมื่อกดปุ่ม "Sign in with Google" ทั้งในหน้า Login และ Register
 */

const props = defineProps<{
  /** role ที่จะ pre-select ไว้ล่วงหน้า (ใช้จาก Register toggle) */
  preSelectedRole?: 'USER' | 'SITTER'
  isLoading?: boolean
}>()

const emit = defineEmits<{
  /** ส่ง role ที่เลือกกลับไป เพื่อให้ parent trigger Google OAuth */
  confirm: [role: 'USER' | 'SITTER']
  cancel: []
}>()

const selected = ref<'USER' | 'SITTER'>(props.preSelectedRole ?? 'USER')

function confirm() {
  emit('confirm', selected.value)
}
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="emit('cancel')"
      />

      <!-- Modal card -->
      <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10">

        <!-- Google icon header -->
        <div class="flex flex-col items-center mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
            <svg class="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <h2 class="text-lg font-bold text-gray-900">Continue with Google</h2>
          <p class="text-sm text-gray-500 mt-1 text-center">คุณเป็นใครใน PetSitter?</p>
        </div>

        <!-- Role selection -->
        <div class="grid grid-cols-2 gap-3 mb-6">

          <!-- Pet Owner card -->
          <button
            type="button"
            @click="selected = 'USER'"
            :class="[
              'relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200',
              selected === 'USER'
                ? 'border-orange-500 bg-orange-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
            ]"
          >
            <!-- checkmark -->
            <div :class="[
              'absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              selected === 'USER' ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'
            ]">
              <svg v-if="selected === 'USER'" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <!-- icon -->
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
              selected === 'USER' ? 'bg-orange-100' : 'bg-white border border-gray-100'
            ]">
              <svg class="w-6 h-6" :class="selected === 'USER' ? 'text-orange-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p :class="['text-sm font-bold text-center', selected === 'USER' ? 'text-orange-600' : 'text-gray-700']">Pet Owner</p>
              <p class="text-xs text-gray-400 text-center mt-0.5">หาคนดูแลสัตว์เลี้ยง</p>
            </div>
          </button>

          <!-- Pet Sitter card -->
          <button
            type="button"
            @click="selected = 'SITTER'"
            :class="[
              'relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200',
              selected === 'SITTER'
                ? 'border-orange-500 bg-orange-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
            ]"
          >
            <!-- checkmark -->
            <div :class="[
              'absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              selected === 'SITTER' ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'
            ]">
              <svg v-if="selected === 'SITTER'" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <!-- icon -->
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
              selected === 'SITTER' ? 'bg-orange-100' : 'bg-white border border-gray-100'
            ]">
              <svg class="w-6 h-6" :class="selected === 'SITTER' ? 'text-orange-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <p :class="['text-sm font-bold text-center', selected === 'SITTER' ? 'text-orange-600' : 'text-gray-700']">Pet Sitter</p>
              <p class="text-xs text-gray-400 text-center mt-0.5">รับดูแลสัตว์เลี้ยง</p>
            </div>
          </button>

        </div>

        <!-- Note for existing users -->
        <p class="text-xs text-gray-400 text-center mb-5 px-2">
          หากคุณมีบัญชีอยู่แล้ว role เดิมของคุณจะถูกใช้ต่อ
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="button"
            @click="emit('cancel')"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            @click="confirm"
            :disabled="isLoading"
            class="grow-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <div v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{{ isLoading ? 'กำลังเปิด Google...' : 'ดำเนินการต่อ' }}</span>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
