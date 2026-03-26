<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Check, X } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<{
    label: string;
    placeholder?: string;
    options: { label: string; value: string | number}[];
    modelValue?: (string | number)[]; // รับค่าเป็น array
    status?: 'normal' | 'success' | 'error';
    disabled?: boolean;
}>() , {
    modelValue: () => [],  // ค่าเริ่มต้นคือ array ว่าง
    status: 'normal',
    disabled: false,
    placeholder: 'Place Holder'
})

const emit = defineEmits<{
    (e: 'update:modelValue' , value: (string | number)[]): void
}>()

const isOpen = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef , () => {
    isOpen.value = false
})

const toggleOption = (value: string | number) => {
    // copy array เดิมมาก่อนเพื่อความปลอดภัย
    const newValue = [...props.modelValue]
    const index = newValue.indexOf(value)

    if (index == -1) {
        newValue.push(value) // ถ้ายนังไม่เคยเลือก ให้เพิ่มเข้าไป
    } else {
        newValue.splice(index, 1) // ถ้าเคยเลือกแล้ว ให้ลบออกไป
    }
    emit('update:modelValue' , newValue)
    // ไม่ได้ใส่ Dropdown (isOpen=false) เพื่อให้ไม่ปิดเองหลังจากที่เลือก
}

// ฟังก์ชันลบ tag
const removeOption = (value: string | number, event: Event) => {
    event.stopPropagation()  // ป้องกันไม่ให้คลิ้กแล้วไปสั่งปิด Dropdown
    const newValue = props.modelValue.filter(v => v !== value)
    emit('update:modelValue' , newValue)
}

// คำนวณหาข้อมูลแบบเต็มๆ ของตัวที่ถูกเลือกมาวาดเป็นป้าย Tag
const selectedOptionObjects = computed(() => {
    return props.options.filter(opt => props.modelValue.includes(opt.value))
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
          class="w-full min-h-[52px] px-4 py-2 rounded-xl border flex justify-between items-center cursor-pointer transition-colors duration-200"
          :class="{
            'border-brand-gray-100 bg-brand-white hover:border-brand-gray-300': status === 'normal' && !disabled && !isOpen,
            'border-brand-orange-700 bg-brand-white': isOpen && status === 'normal',
            'border-brand-green-500 bg-brand-white': status === 'success' && !disabled,
            'border-brand-red-500 bg-brand-white text-brand-red-500': status === 'error' && !disabled,
            'border-brand-gray-100 bg-brand-gray-50 text-brand-gray-300 cursor-not-allowed': disabled,
          }"
        >
          <div class="flex flex-wrap gap-2 flex-1 mr-2">
            <span v-if="selectedOptionObjects.length === 0" class="body-2 text-brand-gray-300 py-1 select-none">
              {{ placeholder }}
            </span>
            
            <div 
              v-for="opt in selectedOptionObjects" 
              :key="opt.value"
              class="flex items-center gap-1 px-3 py-1 bg-brand-orange-50 text-brand-orange-700 rounded-full text-sm select-none"
            >
              {{ opt.label }}
              <X 
                class="w-4 h-4 cursor-pointer hover:text-brand-orange-900 transition-colors" 
                @click="removeOption(opt.value, $event)" 
              />
            </div>
          </div>
          
          <ChevronDown 
            class="w-5 h-5 flex-shrink-0 transition-transform duration-200" 
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
              @click="toggleOption(option.value)"
              class="px-4 py-3 body-2 cursor-pointer flex justify-between items-center transition-colors select-none"
              :class="{ 
                'bg-brand-orange-50 text-brand-orange-700 font-bold': modelValue.includes(option.value), 
                'text-brand-gray-900 hover:bg-brand-gray-50': !modelValue.includes(option.value) 
              }"
            >
              {{ option.label }}
              
              <Check v-if="modelValue.includes(option.value)" class="w-5 h-5 text-brand-orange-700" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </template>