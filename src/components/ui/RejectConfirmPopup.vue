<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
defineProps<{
    title?: string
    message: string
    confirmLabel?: string
    reasonPlaceholder?: string
}>()

defineEmits<{
    confirm: []
    cancel: []
}>()
</script>

<template>
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl font-sans">

        <!-- Header -->
        <div class="flex items-center justify-between pb-4">
            <h2 class="headline-4 text-brand-black font-bold">{{ title ?? 'Reject Confirmation' }}</h2>
            <button @click="$emit('cancel')" class="text-brand-gray-300 hover:text-brand-gray-500 text-2xl">
                ✕
            </button>
        </div>

        <hr class="border-brand-gray-100 mb-4 -mx-6" />

        <p class="body-2 text-gray-400 font-medium mb-4">{{ message }}</p>

        <div class="mb-4">
            <label class="body-2 text-brand-black font-medium mb-1 block">Reason and suggestion</label>
            <textarea :placeholder="reasonPlaceholder ?? 'Admin\'s suggestion here'"
                class="w-full border border-brand-gray-100 rounded-xl p-3 body-3 text-brand-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-brand-orange-100" />
        </div>

        <div class="flex items-center justify-between mt-2">
            <Button @click="$emit('cancel')"
                variant="secondary">
                Cancel
            </Button>
            <Button @click="$emit('confirm')"
                variant="primary">
                {{ confirmLabel ?? 'Reject' }}
            </Button>
        </div>

    </div>
</template>
