<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string;
  lastMessage: string;
  avatarUrl?: string;
  unreadCount?: number;
  isActive?: boolean;
}>(), {
  avatarUrl: 'https://ui-avatars.com/api/?name=User&background=F4F5F8&color=1F2937',
  unreadCount: 0,
  isActive: false
})
</script>

<template>
  <div 
    class="flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200"
    :class="isActive ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'"
  >
    <img 
      :src="avatarUrl" 
      :alt="name" 
      class="w-12 h-12 rounded-full object-cover shrink-0" 
    />

    <div class="flex flex-col flex-1 min-w-0">
      <span class="body-2 text-brand-white font-bold truncate">{{ name }}</span>
      <span class="body-3 text-brand-gray-300 truncate">{{ lastMessage }}</span>
    </div>

    <div 
      v-if="unreadCount > 0" 
      class="bg-brand-orange-700 text-brand-white w-6 h-6 rounded-full flex items-center justify-center body-3 font-bold shrink-0"
    >
      {{ unreadCount }}
    </div>

  </div>
</template>