<template>
    <div
      v-if="visible"
      class="fixed top-24 right-5 px-4 py-3 rounded-lg text-white shadow-lg z-9999"
      :class="type === 'success' ? 'bg-brand-green-500' : 'bg-brand-red-500'"
    >
      {{ message }}
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToast } from "@/composables/useToast";
  
  const { message, type, visible } = useToast();
  </script>