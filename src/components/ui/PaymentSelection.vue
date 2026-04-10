<script setup lang="ts">
import { computed } from 'vue';
import { CreditCard, Banknote } from 'lucide-vue-next';

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
  icon: {
    type: String,
    default: 'cash',
    // ตัวเลือก: 'cash', 'card'
  }
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
    class="w-[212px] h-[80px] mx-auto flex items-center justify-center gap-4 px-6 
    rounded-[999px] border transition-all duration-300 active:scale-[0.98] outline-none group"
    :class="isSelected 
      ? 'border-brand-orange-700 bg-white shadow-sm' 
      : 'border-brand-gray-100 bg-white hover:border-brand-orange-300'"
  >
    <div 
      class="flex items-center gap-3 transition-colors duration-300"
      :class="isSelected ? 'text-brand-orange-700' : 'text-brand-gray-300'"
    >
      <div class="flex items-center justify-center shrink-0">
        <Banknote v-if="icon === 'cash'" :size="30" />
        <CreditCard v-else :size="30" />
      </div>
      
      <span class="body-1 font-bold select-none leading-tight">
        {{ label }}
      </span>
    </div>
  </button>
</template>
