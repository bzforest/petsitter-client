<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => props.modelValue === props.value);

const select = () => {
  if (props.disabled) return;
  emit('update:modelValue', props.value);
};
</script>

<template>
  <label 
    class="inline-flex items-center gap-3 cursor-pointer group"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @click.prevent="select"
  >
    <div 
      class="relative w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0"
      :class="[
        isChecked 
          ? 'border-brand-orange-700' 
          : 'bg-white border-brand-gray-100 group-hover:border-brand-orange-300',
        { 'bg-brand-gray-100/30 border-brand-gray-100': disabled }
      ]"
    >
      <div 
        v-if="isChecked" 
        class="w-3.5 h-3.5 rounded-full bg-brand-orange-700 transition-all duration-200"
      />
    </div>
    <span 
      v-if="label" 
      class="body-2 font-bold select-none transition-colors"
      :class="isChecked ? 'text-brand-gray-900' : 'text-brand-gray-300'"
    >
      {{ label }}
    </span>
  </label>
</template>
