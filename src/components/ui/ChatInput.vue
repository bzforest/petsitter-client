<script setup lang="ts">
import { Image, Send } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue?: string;
    placeholder?: string;
}>() , {
    modelValue: '',
    placeholder: 'Message here...'
})

const emit = defineEmits<{
    (e: 'update:modelValue' , value: string): void;
    (e: 'send' , message: string): void;
    (e: 'attach'): void;
}>()

// ฟังก์ชันกดส่งข้อความ
const handleSend = () => {
    if(props.modelValue && props.modelValue.trim() !== '') {
        emit('send' , props.modelValue)
    }
}
</script>

<template>
    <div class="flex items-center gap-3 md:gap-4 p-4 bg-white border-t border-brand-gray-100 w-full">
      
      <button 
        @click="emit('attach')"
        class="text-brand-gray-400 hover:text-brand-gray-600 transition-colors shrink-0"
      >
        <Image class="w-7 h-7 md:w-9 md:h-9 md:p-2 p-1 text-brand-gray-700 bg-brand-gray-100 rounded-full cursor-pointer hover:scale-105" />
      </button>
  
      <input 
        type="text" 
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="handleSend"
        :placeholder="placeholder"
        class="flex-1 bg-transparent border-none outline-none body-2 text-brand-gray-900 placeholder:text-brand-gray-300 min-w-0"
      />
  
      <button 
        @click="handleSend"
        :disabled="!modelValue || modelValue.trim() === ''"
        class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange-700 hover:bg-brand-orange-600 text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:cursor-pointer"
      >
        <Send class="w-4 h-4 md:w-5 md:h-5 ml-0.5 md:ml-1" />
      </button>
  
    </div>
  </template>