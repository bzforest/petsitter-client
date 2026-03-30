<script setup lang="ts">
import { computed } from 'vue';
import Badge from './Badge.vue';
import { Check } from 'lucide-vue-next';

interface Props {
  name: string;
  type: string;
  image: string;
  modelValue?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  badgeColor?: 'pink' | 'yellow' | 'blue' | 'green' | 'red' | 'gray';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  selectable: false,
  disabled: false,
  badgeColor: 'pink'
});

const emit = defineEmits(['update:modelValue', 'click']);

const isSelected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const handleClick = () => {
  if (props.disabled) return;
  if (props.selectable) {
    isSelected.value = !isSelected.value;
  }
  emit('click');
};

const cardClasses = computed(() => {
  return [
    'relative flex flex-col items-center p-6 bg-white rounded-[32px] border-2 transition-all duration-200 cursor-pointer w-[240px]',
    props.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md',
    props.selectable && isSelected.value ? 'border-brand-orange-500' : 'border-brand-gray-100',
    !props.selectable ? 'border-brand-gray-100' : ''
  ];
});

const checkboxClasses = computed(() => {
  return [
    'absolute top-4 right-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
    isSelected.value 
      ? 'bg-brand-orange-500 border-brand-orange-500' 
      : 'bg-white border-brand-gray-100'
  ];
});
</script>

<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Checkbox Icon (only if selectable) -->
    <div v-if="selectable" :class="checkboxClasses">
      <Check v-if="isSelected" :size="16" color="white" stroke-width="3" />
    </div>

    <!-- Pet Image -->
    <div class="w-32 h-32 rounded-full overflow-hidden mb-4 bg-brand-gray-50 flex items-center justify-center">
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
    </div>




    <!-- Pet Info -->
    <h3 class="headline-4 text-brand-gray-900 mb-2">{{ name }}</h3>

    <Badge :label="type" :color="badgeColor" variant="pill" />
  </div>
</template>

<style scoped>
/* Optional: additive styles if needed, though Tailwind covers most */
</style>
