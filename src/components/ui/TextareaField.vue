<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string;
  placeholder?: string;
  status?: 'normal' | 'success' | 'error';
  disabled?: boolean;
  modelValue?: string;
}>(), {
  status: 'normal',
  disabled: false,
  placeholder: 'Place Holder'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="body-2 text-brand-gray-900 font-bold">
      {{ label }}
    </label>
    
    <div class="relative">
      <textarea
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        @input="handleInput"
        class="w-full min-h-[120px] px-4 py-3 rounded-xl border outline-none body-2 transition-colors duration-200 resize-none"
        :class="{
          'border-brand-gray-100 bg-brand-white text-brand-gray-900 placeholder:text-brand-gray-300 hover:border-brand-gray-300 focus:border-brand-orange-700': status === 'normal' && !disabled,
          'border-brand-green-500 bg-brand-white text-brand-gray-900 focus:border-brand-green-500': status === 'success' && !disabled,
          'border-brand-red-500 bg-brand-white text-brand-red-500 placeholder:text-brand-red-500 focus:border-brand-red-500': status === 'error' && !disabled,
          'border-brand-gray-100 bg-brand-gray-50 text-brand-gray-300 cursor-not-allowed': disabled
        }"
      ></textarea>
    </div>
  </div>
</template>