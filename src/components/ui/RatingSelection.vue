<script setup lang="ts">
import { Star } from 'lucide-vue-next';

const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const isSelected = computed(() => props.modelValue === props.rating);

const select = () => {
  emit('update:modelValue', props.rating);
};

import { computed } from 'vue';
</script>

<template>
  <button 
    @click="select"
    class="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200 border-2"
    :class="isSelected 
      ? 'border-brand-orange-700 bg-white shadow-sm' 
      : 'border-brand-gray-50 bg-white hover:border-brand-gray-100'"
  >
    <span class="headline-4 text-brand-gray-500 font-bold w-4 text-left">
      {{ rating }}
    </span>
    
    <div class="flex items-center gap-1">
      <Star 
        v-for="i in 5" 
        :key="i"
        :size="20"
        :fill="i <= rating ? '#1CCD83' : '#AEB1C3'"
        :color="i <= rating ? '#1CCD83' : '#AEB1C3'"
        class="transition-colors duration-200"
      />
    </div>
  </button>
</template>
