<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { SitterProfile } from '@/api/admin/sitterProfiles'
import SitterStatusBadge from './SitterStatusBadge.vue'

const props = defineProps<{
  profile: SitterProfile
}>()

const router = useRouter()

const AVATAR_COLORS = [
  'bg-orange-400',
  'bg-sky-400',
  'bg-violet-400',
  'bg-emerald-400',
  'bg-rose-400',
  'bg-amber-400',
]

function avatarInitial(email: string): string {
  return (email?.[0] ?? '?').toUpperCase()
}

function avatarColor(email: string): string {
  return AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length]
}

function goToDetail() {
  router.push({ name: 'admin-sitter-detail', params: { id: props.profile.id } })
}
</script>

<template>
  <div
    class="grid grid-cols-[2fr_2fr_3fr_1.5fr] items-center hover:bg-orange-50/60 transition-colors cursor-pointer"
    @click="goToDetail"
  >
    <!-- Full Name (avatar + username) -->
    <div class="px-5 py-3.5 flex items-center gap-3 min-w-0">
      <div
        v-if="profile.profileImage"
        class="w-9 h-9 rounded-full shrink-0 overflow-hidden"
      >
        <img :src="profile.profileImage" :alt="profile.fullName ?? ''" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white body-3 font-semibold"
        :class="avatarColor(profile.email)"
      >
        {{ avatarInitial(profile.email) }}
      </div>
      <span class="body-2 font-medium text-brand-black truncate">
        {{ profile.fullName ?? profile.email.split('@')[0] }}
      </span>
    </div>

    <!-- Pet Sitter Name (tradeName) -->
    <div class="px-5 py-3.5 min-w-0">
      <span class="body-2 font-medium text-brand-black truncate block">
        {{ profile.tradeName ?? '—' }}
      </span>
    </div>

    <!-- Email -->
    <div class="px-5 py-3.5 min-w-0">
      <span class="body-2 font-medium text-brand-black truncate block">
        {{ profile.email }}
      </span>
    </div>

    <!-- Status -->
    <div class="px-5 py-3.5">
      <SitterStatusBadge :status="profile.status" />
    </div>
  </div>
</template>
