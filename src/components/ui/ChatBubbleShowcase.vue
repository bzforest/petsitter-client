<script setup lang="ts">
import ChatBubble from './ChatBubble.vue'
</script>

<template>
    <div class="pt-8">
      <h3 class="headline-3 text-brand-gray-900 mb-6">8. Chat Bubble</h3>
      
      <div class="bg-brand-white p-4 md:p-8 rounded-xl border border-brand-gray-100 flex flex-col gap-4 max-w-[500px] mx-auto">
        
        <ChatBubble 
          :isSender="true"
          message="ถ่ายรูปน้องโบ้ให้ผมดูหน่อยสิ"
        />
  
        <ChatBubble 
          :isSender="false"
          message="สักครู่นะครับลูกค้า"
          avatarUrl="https://ui-avatars.com/api/?name=Jane+Maison&background=F4F5F8&color=1F2937"
        />
  
        <ChatBubble 
          :isSender="false"
          imageUrl="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"
          avatarUrl="https://ui-avatars.com/api/?name=Jane+Maison&background=F4F5F8&color=1F2937"
        />
  
        <ChatBubble 
          :isSender="true"
          message="น่าร้ากกกก"
        />
        
        <ChatBubble 
          :isSender="true"
          message="ขอบคุณครับ ไว้เดี๋ยวผมรีบไปรับ"
        />
  
      </div>
    </div>
  </template>