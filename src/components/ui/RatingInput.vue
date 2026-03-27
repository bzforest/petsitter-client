<script setup lang="ts">
import { ref } from 'vue';
import { Star } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  maxStars: {
    type: Number,
    default: 5,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue']);

const hoverRating = ref(0);

const setRating = (rating: number) => {
  if (props.disabled) return;
  emit('update:modelValue', rating);
};
</script>

<template>
  <div 
    class="flex items-center gap-2"
    @mouseleave="hoverRating = 0"
  >
    <button
      v-for="i in maxStars"
      :key="i"
      type="button"
      class="transition-transform duration-150 active:scale-90 outline-none"
      :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
      @click="setRating(i)"
      @mouseenter="hoverRating = i"
    >
      <Star 
        :size="32"
        :fill="i <= (hoverRating || modelValue) ? '#1CCD83' : '#AEB1C3'"
        :color="i <= (hoverRating || modelValue) ? '#1CCD83' : '#AEB1C3'"
        class="transition-colors duration-200"
      />
    </button>
  </div>
</template>
