<script setup lang="ts">
const props = withDefaults(defineProps<{
    isSender?: boolean;   // true = ฝั่งเรา (สีส้ม), false = ฝั่งเขา (สีขาว)
    message?: string;
    imageUrl?: string;
    avatarUrl?: string;
}>() , {
    isSender: false ,
    avatarUrl: 'https://ui-avatars.com/api/?name=User&background=F4F5F8&color=1F2937'
})
</script>

<template>
    <div 
      class="flex w-full"
      :class="isSender ? 'justify-end' : 'justify-start'"
    >
      <div 
        class="flex gap-2 md:gap-3 max-w-[85%] md:max-w-[75%]"
        :class="isSender ? 'flex-row-reverse' : 'flex-row'"
      >
        
        <img 
          v-if="!isSender"
          :src="avatarUrl" 
          alt="avatar" 
          class="w-10 h-10 rounded-full object-cover shrink-0 mt-auto" 
        />
  
        <div 
          class="flex flex-col gap-2"
          :class="isSender ? 'items-end' : 'items-start'"
        >
          <img 
            v-if="imageUrl"
            :src="imageUrl"
            alt="chat image"
            class="rounded-xl w-full max-w-[240px] md:max-w-[280px] object-cover shadow-sm border border-brand-gray-100"
          />
          
          <div 
            v-if="message"
            class="px-4 py-2.5 body-2 w-fit break-words shadow-sm"
            :class="[
              isSender 
                ? 'bg-brand-orange-900 text-white rounded-2xl rounded-br-sm' 
                : 'bg-white border border-brand-gray-100 text-brand-gray-900 rounded-2xl rounded-bl-sm'
            ]"
          >
            {{ message }}
          </div>
        </div>
  
      </div>
    </div>
  </template>