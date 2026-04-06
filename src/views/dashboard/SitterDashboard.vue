<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-blue-50 flex flex-col items-center justify-center gap-6">
    <div class="bg-white rounded-2xl shadow-sm px-10 py-8 text-center max-w-md w-full">
      <div class="text-5xl mb-4">🐶</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Sitter Dashboard</h1>
      <p class="text-gray-500 text-sm mb-2">Welcome back, {{ authStore.email }}!</p>
      <span
        class="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6"
      >
        {{ authStore.role }}
      </span>
      <p class="text-gray-400 text-sm mb-8">
        This is a placeholder for the Sitter dashboard. More features coming soon.
      </p>
      <button
        @click="handleLogout"
        class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors text-sm"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
