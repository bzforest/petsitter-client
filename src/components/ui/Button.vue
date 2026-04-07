<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'social' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  loading: false,
  type: 'button'
});

// กำหนดสไตล์ตาม Variant สอดคล้องกับ Design System ในงานนี้
const variantClasses = {
  // Primary เปลี่ยนสีพื้นหลังตามสถานะ
  primary: 'bg-brand-orange-700 text-white hover:bg-brand-orange-500 active:bg-brand-orange-900 shadow-sm',
  
  // Secondary/Ghost/Icon ปรับเฉพาะสี Font เมื่อ Hover/Active (พื้นหลังคงที่)
  secondary: 'bg-brand-orange-50 text-brand-orange-700 hover:text-brand-orange-500 active:text-brand-orange-900 transition-colors duration-200',
  ghost: 'bg-transparent text-brand-orange-700 hover:text-brand-orange-500 active:text-brand-orange-900 transition-colors duration-200',
  icon: 'bg-brand-orange-50 text-brand-orange-700 hover:text-brand-orange-500 active:text-brand-orange-900 transition-colors duration-200',
  
  // Social (ค่าคงที่เดิม)
  social: 'bg-[#F0F2F5] text-[#1C1E21] hover:bg-[#E4E6EB] active:bg-[#D8DADF]',
};

// สไตล์เมื่อ Disabled (จาก Design System)
const disabledClasses = 'bg-brand-gray-100/50 text-brand-gray-300 cursor-not-allowed pointer-events-none border-none';

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center transition-all duration-200 active:scale-95 font-bold body-2 whitespace-nowrap outline-none';
  
  // จัดรูปทรง
  const shape = props.variant === 'icon' 
    ? 'w-12 h-12 rounded-full p-0 flex' 
    : 'px-6 py-3 rounded-[16px] gap-2.5';
    
  // ถ้ากำลังโหลด หรือ ปิดใช้งาน ให้ใช้ disabledClasses
  const style = (props.disabled || props.loading) ? disabledClasses : variantClasses[props.variant];
  
  return [base, shape, style].join(' ');
});
</script>

<template>
  <button 
    :type="type" 
    :class="buttonClasses" 
    :disabled="disabled || loading"
  >
    <!-- Loading Spinner -->
    <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />

    <template v-else>
      <!-- Left Icon Slot -->
      <div v-if="$slots['left-icon']" class="flex items-center justify-center transition-transform shrink-0">
        <slot name="left-icon"></slot>
      </div>
      
      <!-- Content Slot -->
      <span v-if="variant !== 'icon'" class="flex items-center">
        <slot></slot>
      </span>

      <!-- Default Slot for Icon Variant -->
      <slot v-if="variant === 'icon'"></slot>

      <!-- Right Icon Slot -->
      <div v-if="$slots['right-icon']" class="flex items-center justify-center transition-transform shrink-0">
        <slot name="right-icon"></slot>
      </div>
    </template>
  </button>
</template>