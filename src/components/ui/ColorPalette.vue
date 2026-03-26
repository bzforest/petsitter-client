<script setup lang="ts">
import ColorSwatch from './ColorSwatch.vue'

// ข้อมูลสีทั้งหมดถูกย้ายมาเก็บที่นี่แทนแล้วครับ!
const orangeColors = [
  { name: 'brand-orange-900', hex: '#E44A0C', bgClass: 'bg-brand-orange-900' },
  { name: 'brand-orange-700', hex: '#FF7037', bgClass: 'bg-brand-orange-700' },
  { name: 'brand-orange-500', hex: '#FF986F', bgClass: 'bg-brand-orange-500' },
  { name: 'brand-orange-300', hex: '#FFB899', bgClass: 'bg-brand-orange-300' },
  { name: 'brand-orange-100', hex: '#FFD5C2', bgClass: 'bg-brand-orange-100' },
  { name: 'brand-orange-50',  hex: '#FFF1EC', bgClass: 'bg-brand-orange-50' },
]

const grayColors = [
  { name: 'brand-gray-900', hex: '#3A3B46', bgClass: 'bg-brand-gray-900' },
  { name: 'brand-gray-700', hex: '#5B5D6F', bgClass: 'bg-brand-gray-700' },
  { name: 'brand-gray-500', hex: '#7B7E8F', bgClass: 'bg-brand-gray-500' },
  { name: 'brand-gray-300', hex: '#AEB1C3', bgClass: 'bg-brand-gray-300' },
  { name: 'brand-gray-100', hex: '#DCDFED', bgClass: 'bg-brand-gray-100' },
  { name: 'brand-gray-50',  hex: '#FFFFFF', bgClass: 'bg-brand-gray-50' },
]
</script>

<template>
  <div>
    <h3 class="headline-3 text-brand-gray-900 mb-6">1. CI</h3>
    
    <div class="mb-6">
      <p class="body-1 text-brand-gray-700 mb-3">Primary Color: Orange</p>
      <div class="flex flex-wrap gap-2">
        <ColorSwatch v-for="item in orangeColors" :key="item.name" :color="item" />
      </div>
    </div>

    <div class="mb-6">
      <p class="body-1 text-brand-gray-700 mb-3">Primary Color: Gray</p>
      <div class="flex flex-wrap gap-2">
        <ColorSwatch v-for="item in grayColors" :key="item.name" :color="item" />
      </div>
    </div>
  </div>
</template>