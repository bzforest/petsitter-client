<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

      <!-- Body -->
      <div class="flex flex-col items-center text-center px-10 py-12 gap-6">

        <!-- Icon -->
        <div class="w-20 h-20 rounded-full bg-brand-green-50 flex items-center justify-center shrink-0">
          <CircleCheck class="w-10 h-10 text-brand-green-500" />
        </div>

        <!-- Text -->
        <div class="flex flex-col gap-2">
          <h3 class="headline-3 text-brand-gray-900">Report Submitted</h3>
          <p class="body-2 text-brand-gray-500 leading-relaxed">
            We have received your complaint.<br />
            Our team will review it and take appropriate action.
          </p>
        </div>

        <!-- Action -->
        <Button
          variant="primary"
          class="w-full rounded-full cursor-pointer mt-2"
          @click="emit('close')"
        >
          Done
        </Button>

      </div>
    </div>
  </div>
</template>
