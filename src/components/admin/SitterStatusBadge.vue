<script setup lang="ts">
import type { SitterStatus } from '@/api/admin/sitterProfiles'

defineProps<{
  status: SitterStatus | null
}>()

const config: Record<SitterStatus, { dot: string; text: string; label: string }> = {
  WAITING_FOR_APPROVE: {
    dot: 'bg-pink-300',
    text: 'text-pink-300',
    label: 'Waiting for approve',
  },
  APPROVED: {
    dot: 'bg-green-500',
    text: 'text-green-600',
    label: 'Approved',
  },
  REJECTED: {
    dot: 'bg-red-500',
    text: 'text-red-500',
    label: 'Rejected',
  },
}
</script>

<template>
  <span
    v-if="status && config[status]"
    class="inline-flex items-center gap-1.5 body-3 font-medium"
    :class="config[status].text"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="config[status].dot" />
    {{ config[status].label }}
  </span>
  <span v-else class="body-3 text-brand-gray-400">—</span>
</template>
