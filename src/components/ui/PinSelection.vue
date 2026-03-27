<script setup lang="ts">
import { computed } from 'vue';
import pinDefaultImg from '@/assets/Pin Selection/Property 1=Default.png';
import pinSelectedImg from '@/assets/Pin Selection/Property 1=Selected.png';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const isSelected = computed(() => props.modelValue === props.value);

const select = () => {
  emit('update:modelValue', props.value);
};
</script>

<template>
  <button 
    @click="select"
    class="relative group transition-transform duration-200 active:scale-95 outline-none"
  >
    <!-- Background Glow Effect for selection -->
    <div 
      v-if="isSelected" 
      class="absolute inset-0 bg-brand-orange-500/10 blur-xl scale-125 rounded-full"
    />
    
    <img 
      :src="isSelected ? pinSelectedImg : pinDefaultImg" 
      class="w-14 h-auto drop-shadow-sm transition-all duration-300"
      :class="isSelected ? 'scale-110 drop-shadow-md' : 'grayscale-[0.2] hover:grayscale-0'"
      alt="Pin selection"
    />
  </button>
</template>
