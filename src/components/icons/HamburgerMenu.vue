<script setup lang="ts">
defineProps<{
  size?: number; // default 24
  color?: string; // default currentColor (รับสีจาก parent)
}>();
</script>

<template>
  <div class="w-7 h-7 rounded-full flex items-center justify-center">
    <svg
      :width="size ?? 24"
      :height="size ?? 24"
      fill="none"
      :stroke="color ?? 'currentColor'"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  </div>
</template>
