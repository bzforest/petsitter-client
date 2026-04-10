<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

      <div class="flex flex-col items-center text-center px-10 py-12 gap-6">

        <!-- Icon -->
        <div class="w-20 h-20 rounded-full bg-brand-orange-50 flex items-center justify-center shrink-0">
          <AlertCircle class="w-10 h-10 text-brand-orange-700" />
        </div>

        <!-- Text -->
        <div class="flex flex-col gap-2">
          <h3 class="headline-3 text-brand-gray-900">Already Reported</h3>
          <p class="body-2 text-brand-gray-500 leading-relaxed">
            You have already submitted a report for this booking.<br />
            Our team is currently reviewing your complaint.
          </p>
        </div>

        <!-- Action -->
        <Button
          variant="primary"
          class="w-full rounded-full cursor-pointer mt-2"
          @click="emit('close')"
        >
          Got it
        </Button>

      </div>
    </div>
  </div>
</template>
