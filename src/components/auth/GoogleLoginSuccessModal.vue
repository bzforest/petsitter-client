<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  email: string
  role: 'USER' | 'SITTER' | 'ADMIN'
}>()

const emit = defineEmits<{
  proceed: []
}>()

const countdown = ref(3)
let timer: ReturnType<typeof setInterval> | null = null

const roleLabel = {
  USER: 'Pet Owner',
  SITTER: 'Pet Sitter',
  ADMIN: 'Admin',
}

const roleDescription = {
  USER: 'You can now find and book pet sitters.',
  SITTER: 'You can now manage your sitter profile.',
  ADMIN: 'You have full access to the admin panel.',
}

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      emit('proceed')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <!-- Modal -->
      <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 z-10 text-center">

        <!-- Success icon -->
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-1">Login Successful!</h2>
        <p class="text-sm text-gray-500 mb-5">Welcome back, {{ email }}</p>

        <!-- Role badge -->
        <div class="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-2">
          <span class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Role</span>
          <span class="text-sm font-bold text-orange-700">{{ roleLabel[role] }}</span>
        </div>

        <p class="text-xs text-gray-400 mb-6">{{ roleDescription[role] }}</p>

        <!-- Proceed button -->
        <button
          @click="emit('proceed')"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm mb-3"
        >
          Enter Now
        </button>

        <!-- Countdown -->
        <p class="text-xs text-gray-400">
          Redirecting automatically in
          <span class="font-bold text-orange-500">{{ countdown }}</span>
          second{{ countdown !== 1 ? 's' : '' }}...
        </p>

      </div>
    </div>
  </Teleport>
</template>
