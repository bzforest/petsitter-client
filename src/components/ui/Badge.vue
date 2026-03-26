<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  variant?: 'status' | 'pill';
  color?: 'pink' | 'yellow' | 'blue' | 'green' | 'red' | 'gray';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'status',
  color: 'gray'
});

// 🎯 Badge Classes
const badgeClasses = computed(() => {
  // Gap 10px ตาม Figma และห้ามตัดบรรทัด (whitespace-nowrap)
  const base = "flex items-center gap-[10px] whitespace-nowrap transition-all duration-200 w-fit";

  // STATUS (dot + text)
  if (props.variant === 'status') {
    const colorMap = {
      pink: "text-brand-pink-500",
      yellow: "text-brand-yellow-500",
      blue: "text-brand-blue-500",
      green: "text-brand-green-500",
      red: "text-brand-red-500",
      gray: "text-brand-gray-500"
    };
    return `${base} body-3 font-medium ${colorMap[props.color]}`;
  }

  // PILL (Pet Type) - ปรับ Padding ตาม Figma (Top/Bottom 4px = py-1, Left/Right 16px = px-4)
  const pillColorMap = {
    pink: "bg-brand-pink-50 border-brand-pink-500 text-brand-pink-500",
    yellow: "bg-brand-yellow-50 border-brand-yellow-500 text-brand-yellow-500",
    blue: "bg-brand-blue-50 border-brand-blue-500 text-brand-blue-500",
    green: "bg-brand-green-50 border-brand-green-500 text-brand-green-500",
    red: "bg-red-50 border-brand-red-500 text-brand-red-500",
    gray: "bg-brand-gray-50 border-brand-gray-300 text-brand-gray-700"
  };

  return `${base} body-3 font-bold px-4 py-1 border rounded-full text-center justify-center min-w-[32px] ${pillColorMap[props.color]}`;
});

// 🎯 Dot
const dotClasses = computed(() => {
  const colorMap = {
    pink: "bg-brand-pink-500",
    yellow: "bg-brand-yellow-500",
    blue: "bg-brand-blue-500",
    green: "bg-brand-green-500",
    red: "bg-brand-red-500",
    gray: "bg-brand-gray-500"
  };
  // จัดตำแหน่งให้กึ่งกลางพอดิบพอดี
  return `w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorMap[props.color]}`;
});
</script>

<template>
  <div :class="badgeClasses">
    <span v-if="variant === 'status'" :class="dotClasses"></span>
    {{ label }}
  </div>
</template>
