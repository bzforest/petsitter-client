<script setup lang="ts">
// เก็บข้อมูล Typography ทั้งหมดไว้ที่นี่
const typographyList = [
  { name: 'Display', class: 'display', detail: 'Satoshi Black - 88 / 96' },
  { name: 'Headline 1', class: 'headline-1', detail: 'Satoshi Bold - 56 / 64' },
  { name: 'Headline 2', class: 'headline-2', detail: 'Satoshi Bold - 36 / 44' },
  { name: 'Headline 3', class: 'headline-3', detail: 'Satoshi Bold - 24 / 32' },
  { name: 'Headline 4', class: 'headline-4', detail: 'Satoshi Bold - 20 / 28' },
  { name: 'Body 1', class: 'body-1', detail: 'Satoshi Medium - 18 / 26' },
  { name: 'Body 2', class: 'body-2', detail: 'Satoshi Medium - 16 / 28' },
  { name: 'Body 3', class: 'body-3', detail: 'Satoshi Medium - 14 / 24' },
]
</script>

<template>
  <div>
    <h3 class="headline-3 text-brand-gray-900 mb-6">2. Typography</h3>
    
    <div class="bg-brand-white p-8 rounded-xl border border-brand-gray-100 flex flex-col gap-8">
      
      <div 
        v-for="item in typographyList" 
        :key="item.name"
        class="flex flex-col md:flex-row md:items-baseline justify-between border-b border-brand-gray-50 pb-6 last:border-0 last:pb-0"
      >
        <div class="w-48 text-brand-gray-500 body-1 font-bold mb-2 md:mb-0">
          {{ item.name }}
        </div>
        
        <div class="flex-1 text-brand-gray-900" :class="item.class">
          {{ item.name }}
        </div>
        
        <div class="text-brand-gray-300 body-2 font-mono text-right md:ml-4 mt-2 md:mt-0">
          {{ item.detail }}
        </div>
      </div>

    </div>
  </div>
</template>