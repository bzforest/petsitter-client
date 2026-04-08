<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import RatingInput from '../ui/RatingInput.vue';
import TextareaField from '../ui/TextareaField.vue';
import Button from '../ui/Button.vue';
import apiClient from '@/api/axios';

interface Props {
  bookingId: number;
  sitterId: number;
  initialRating?: number;
  initialComment?: string;
  reviewId?: number | null;
  mode: 'create' | 'edit';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const rating = ref(props.initialRating || 0);
const comment = ref(props.initialComment || '');
const isSubmitting = ref(false);
const error = ref('');

// Character limit based on DB schema (255)
const MAX_COMMENT_LENGTH = 255;

watch(comment, (newVal) => {
  if (newVal.length > MAX_COMMENT_LENGTH) {
    comment.value = newVal.slice(0, MAX_COMMENT_LENGTH);
  }
});

const handleSubmit = async () => {
  if (rating.value === 0) {
    error.value = 'Please selection a rating';
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    if (props.mode === 'create') {
      await apiClient.post('/api/reviews', {
        bookingId: props.bookingId,
        sitterId: props.sitterId,
        rating: rating.value,
        comment: comment.value
      });
    } else {
      await apiClient.patch(`/api/reviews/${props.reviewId}`, {
        rating: rating.value,
        comment: comment.value
      });
    }
    emit('success');
    emit('close');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to submit review';
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
        <h3 class="headline-3 text-brand-gray-600">
          {{ mode === 'create' ? 'Review & Rating' : 'Edit Review' }}
        </h3>
        <button @click="emit('close')" class="text-brand-gray-400 hover:text-brand-gray-600 transition cursor-pointer">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-8 space-y-8">
        <div class="space-y-4 flex flex-col justify-center items-center gap-4">
          <label class="headline-3 text-brand-gray-900 block">What is your rate?</label>
          <RatingInput v-model="rating" />
        </div>

        <div class="space-y-2">
          <TextareaField 
            label="Share more about your experience"
            v-model="comment"
            placeholder="Your review..."
            class="text-center"
            :status="error ? 'error' : 'normal'"
          />
          <div class="flex justify-between items-center">
            <p v-if="error" class="body-3 text-brand-red-500 font-bold">{{ error }}</p>
            <p v-else></p>
            <p class="body-3 text-brand-gray-300">{{ comment.length }}/{{ MAX_COMMENT_LENGTH }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <Button 
            variant="secondary" 
            class="flex-1 rounded-full cursor-pointer" 
            @click="emit('close')"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            class="flex-1 rounded-full cursor-pointer" 
            @click="handleSubmit"
            :loading="isSubmitting"
            :disabled="rating === 0"
          >
            {{ mode === 'create' ? 'Post Review' : 'Update Review' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
