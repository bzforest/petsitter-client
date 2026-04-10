<script setup lang="ts">
const props = defineProps<{
  /** role ที่ user มีอยู่จริงใน system */
  accountRole: 'USER' | 'SITTER' | 'ADMIN'
  /** role ที่ user เลือกตอน login (ผิด) */
  selectedRole: 'USER' | 'SITTER' | 'ADMIN'
}>()

const emit = defineEmits<{
  tryAgain: []
}>()

const roleLabel: Record<string, string> = {
  USER: 'Pet Owner',
  SITTER: 'Pet Sitter',
  ADMIN: 'Admin',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay — ไม่ให้ปิดโดยการคลิก backdrop เพราะต้องการให้ user กด Try Again เอง -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <!-- Modal -->
      <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 z-10 text-center">

        <!-- Warning icon -->
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2">Login Failed</h2>
        <p class="text-sm text-gray-500 mb-5">
          This Google account already has an existing role in the system.<br />
          You cannot change your role.
        </p>

        <!-- Role comparison -->
        <div class="bg-gray-50 rounded-2xl p-4 mb-5 text-left space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400 font-medium">Role you selected</span>
            <span class="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
              {{ roleLabel[selectedRole] ?? selectedRole }}
            </span>
          </div>
          <div class="border-t border-gray-200" />
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400 font-medium">Your actual role</span>
            <span class="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              {{ roleLabel[accountRole] ?? accountRole }}
            </span>
          </div>
        </div>

        <p class="text-xs text-gray-400 mb-5">
          Please login again and select
          <span class="font-semibold text-orange-600">{{ roleLabel[accountRole] ?? accountRole }}</span>
          to continue.
        </p>

        <!-- Try Again button -->
        <button
          @click="emit('tryAgain')"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Try Again
        </button>

      </div>
    </div>
  </Teleport>
</template>
