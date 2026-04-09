<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import TextareaField from '@/components/ui/TextareaField.vue';
import Button from '@/components/ui/Button.vue';
import apiClient from '@/api/axios';

const props = defineProps<{
  bookingId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const MAX_ISSUE_LENGTH = 50;

const issue = ref('');
const description = ref('');
const isSubmitting = ref(false);
const issueError = ref('');
const descriptionError = ref('');

const validate = (): boolean => {
  issueError.value = '';
  descriptionError.value = '';

  if (!issue.value.trim()) {
    issueError.value = 'Issue is required';
  } else if (issue.value.length > MAX_ISSUE_LENGTH) {
    issueError.value = `Issue must not exceed ${MAX_ISSUE_LENGTH} characters`;
  }

  if (!description.value.trim()) {
    descriptionError.value = 'Description is required';
  }

  return !issueError.value && !descriptionError.value;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    await apiClient.post('/api/reports', {
      bookingId: props.bookingId,
      issue: issue.value.trim(),
      description: description.value.trim(),
    });
    emit('success');
    emit('close');
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to submit report';
    issueError.value = message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-brand-gray-50">
        <h3 class="headline-3 text-brand-gray-600">Report</h3>
        <button
          @click="emit('close')"
          class="text-brand-gray-400 hover:text-brand-gray-600 transition cursor-pointer"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-8 space-y-6">

        <!-- Issue Field -->
        <div class="flex flex-col gap-2">
          <label class="body-2 text-brand-gray-900 font-bold">Issue</label>
          <input
            v-model="issue"
            type="text"
            placeholder="Subject"
            :maxlength="MAX_ISSUE_LENGTH + 10"
            class="w-full px-4 py-3 rounded-xl border outline-none body-2 transition-colors duration-200"
            :class="issueError
              ? 'border-brand-red-500 text-brand-red-500 placeholder:text-brand-red-500 focus:border-brand-red-500'
              : 'border-brand-gray-100 bg-brand-white text-brand-gray-900 placeholder:text-brand-gray-300 hover:border-brand-gray-300 focus:border-brand-orange-700'"
          />
          <div class="flex justify-between items-center">
            <p v-if="issueError" class="body-3 text-brand-red-500 font-bold">{{ issueError }}</p>
            <p v-else></p>
            <p class="body-3" :class="issue.length > MAX_ISSUE_LENGTH ? 'text-brand-red-500 font-bold' : 'text-brand-gray-300'">
              {{ issue.length }}/{{ MAX_ISSUE_LENGTH }}
            </p>
          </div>
        </div>

        <!-- Description Field -->
        <div class="flex flex-col gap-2">
          <TextareaField
            label="Description"
            v-model="description"
            placeholder="Describe detail..."
            :status="descriptionError ? 'error' : 'normal'"
          />
          <p v-if="descriptionError" class="body-3 text-brand-red-500 font-bold">{{ descriptionError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center pt-2">
          <Button
            variant="secondary"
            class="rounded-full cursor-pointer"
            @click="emit('close')"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            class="rounded-full cursor-pointer"
            @click="handleSubmit"
            :loading="isSubmitting"
          >
            Send Report
          </Button>
        </div>
      </div>

    </div>
  </div>
</template>
