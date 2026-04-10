<script setup lang="ts">
import Button from "@/components/ui/Button.vue";

const props = defineProps<{
  title?: string;
  message: string;
  confirmLabel?: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <section class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl font-sans">
    <header class="flex items-center justify-between pb-4">
      <h2 class="headline-4 text-brand-black font-bold">{{ props.title ?? "Reject Confirmation" }}</h2>
      <button type="button" @click="$emit('cancel')" class="text-brand-gray-300 hover:text-brand-gray-500 text-2xl">
        ✕
      </button>
    </header>

    <hr class="border-brand-gray-100 mb-4 -mx-6" />

    <p class="body-2 text-gray-400 font-medium mb-4">{{ props.message }}</p>

    <footer class="flex items-center justify-between mt-2">
      <Button @click="$emit('cancel')" variant="secondary">Cancel</Button>
      <Button @click="$emit('confirm')" variant="primary">{{ props.confirmLabel ?? "Reject Booking" }}</Button>
    </footer>
  </section>
</template>
