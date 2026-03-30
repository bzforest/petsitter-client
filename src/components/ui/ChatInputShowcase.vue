<script setup lang="ts">
import ChatInput from './ChatInput.vue';
import { ref } from 'vue';

const currentMessage = ref('')
</script>

<template>
    <h3 class="headline-3 text-brand-gray-900 mb-6 mt-12">9. Chat Input</h3>
    
    <div class="md:p-4 rounded-xl border-brand-gray-100 flex flex-col gap-4 max-w-[500px] mx-auto">
      
      <ChatInput 
        v-model="currentMessage"
        @send="(msg) => console.log('ส่งข้อความ: ', msg)"
        @attach="() => console.log('คลิกปุ่มแนบรูปภาพ')"
      />

      <div class="body-3 text-brand-gray-500 text-center">
        ข้อความที่กำลังพิมพ์: <span class="text-brand-orange-500 font-bold">{{ currentMessage || '-' }}</span>
      </div>

    </div>
</template>