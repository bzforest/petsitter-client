<script setup lang="ts">
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false,
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: null,
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

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue === true;
});

const toggle = () => {
  if (props.disabled) return;

  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue];
    if (isChecked.value) {
      const index = newValue.indexOf(props.value);
      if (index > -1) newValue.splice(index, 1);
    } else {
      newValue.push(props.value);
    }
    emit('update:modelValue', newValue);
  } else {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <label 
    class="inline-flex items-center gap-3 cursor-pointer group"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @click.prevent="toggle"
  >
    <div 
      class="relative w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center shrink-0"
      :class="[
        isChecked 
          ? 'bg-brand-orange-700 border-brand-orange-700' 
          : 'bg-white border-brand-gray-100 group-hover:border-brand-orange-300',
        { 'bg-brand-gray-100/30 border-brand-gray-100': disabled }
      ]"
    >
      <Check 
        v-if="isChecked" 
        class="text-white w-4 h-4 stroke-[4px]" 
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
