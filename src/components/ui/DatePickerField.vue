<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    label: string;
    status?: 'normal' | 'success' | 'error';
    disabled?: boolean;
    modelValue?: string;   // ค่าที่ได้จะเป็น Format: YYYY-MM-DD
}>() , {
    status: 'normal',
    disabled: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue' , value: string): void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue' , target.value)
}
</script>

<template>
    <div class="flex flex-col gap-2">
      <label class="body-2 text-brand-gray-900 font-bold">
        {{ label }}
      </label>
      
      <div class="relative">
        <input
          type="date"
          :disabled="disabled"
          :value="modelValue"
          @input="handleInput"
          class="w-full px-4 py-3 rounded-xl border outline-none body-2 transition-colors duration-200 date-input"
          :class="{
            'border-brand-gray-100 bg-brand-white hover:border-brand-gray-300 focus:border-brand-orange-700': status === 'normal' && !disabled,
            'border-brand-green-500 bg-brand-white focus:border-brand-green-500': status === 'success' && !disabled,
            'border-brand-red-500 bg-brand-white text-brand-red-500 focus:border-brand-red-500': status === 'error' && !disabled,
            'border-brand-gray-100 bg-brand-gray-50 text-brand-gray-300 cursor-not-allowed': disabled,
            'text-brand-gray-900': modelValue,
            'text-brand-gray-300': !modelValue /* ถ้ายังไม่เลือกวันที่ ให้สีจางๆ เหมือน Placeholder */
          }"
        />
        
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gray-500">
          <Calendar class="w-5 h-5" />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* เวทมนตร์ CSS: 
    ซ่อนไอคอนปฏิทินดั้งเดิมของเบราว์เซอร์ 
    และขยายพื้นที่กด (Hitbox) ให้เต็มกล่อง เพื่อให้ยูสเซอร์คลิกตรงไหนปฏิทินก็เด้ง 
  */
  .date-input::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  </style>