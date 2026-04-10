<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<{
    label?: string;
    placeholder?: string;
    // Dropdown ต้องมีตัวเลือก (option) ส่งมาให้มันด้วย
    options: { label: string; value: string | number } [];
    modelValue?: string | number;
    status?: 'normal' | 'success' | 'error';
    disabled?: boolean;
}>(), {
    status: 'normal',
    disabled: false,
    placeholder: 'Place Holder'
})

const emit = defineEmits<{
    (e: 'update:modelValue' , value: string | number): void
}>()

// ตัวแปรเก็บสถานะว่า Dropdown เปิดหรือปิดอยู่
const isOpen = ref(false)
// ตัวแปรอ้างอิงถึงตัวกล่อง Dropdown
const dropdownRef = ref(null)

// เวทมนตร์: ถ้าคลิกนอก dropdownRef ให้สั่งปิด (isOpen = false)
onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

// ฟังก์ชันตอนกดเลือก Item
const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
  isOpen.value = false // เลือกเสร็จปุ๊บ พับกล่องเก็บ
}

// คำนวณหาคำ (Label) ที่จะมาโชว์ตอนที่เลือกเสร็จแล้ว
const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

</script>

<template>
    <div class="flex flex-col gap-2" ref="dropdownRef">
      <label class="body-2 text-brand-gray-900 font-bold">
        {{ label }}
      </label>
      
      <div class="relative">
        <div 
          @click="!disabled && (isOpen = !isOpen)"
          class="w-full px-4 py-3 rounded-xl border flex justify-between items-center cursor-pointer transition-colors duration-200"
          :class="{
            'border-brand-gray-100 bg-brand-white hover:border-brand-gray-300': status === 'normal' && !disabled && !isOpen,
            'border-brand-orange-700 bg-brand-white': isOpen && status === 'normal', /* ถ้าเปิดอยู่ให้ขอบส้ม */
            'border-brand-green-500 bg-brand-white': status === 'success' && !disabled,
            'border-brand-red-500 bg-brand-white text-brand-red-500': status === 'error' && !disabled,
            'border-brand-gray-100 bg-brand-gray-50 text-brand-gray-300 cursor-not-allowed': disabled,
            'text-brand-gray-900': modelValue,
            'text-brand-gray-300': !modelValue
          }"
        >
          <span class="body-2 truncate select-none">{{ selectedLabel }}</span>
          
          <ChevronDown 
            class="w-5 h-5 transition-transform duration-200" 
            :class="isOpen ? 'rotate-180 text-brand-orange-700' : 'text-brand-gray-500'" 
          />
        </div>
  
        <transition 
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-if="isOpen" 
            class="absolute z-50 w-full mt-2 bg-brand-white border border-brand-gray-100 rounded-xl shadow-lg py-2 max-h-60 overflow-auto"
          >
            <div 
              v-for="option in options" 
              :key="option.value"
              @click="selectOption(option.value)"
              class="px-4 py-3 body-2 cursor-pointer flex justify-between items-center transition-colors select-none"
              :class="{ 
                'bg-brand-orange-50 text-brand-orange-700 font-bold': modelValue === option.value, 
                'text-brand-gray-900 hover:bg-brand-gray-50': modelValue !== option.value 
              }"
            >
              {{ option.label }}
              
              <Check v-if="modelValue === option.value" class="w-5 h-5 text-brand-orange-700" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </template>