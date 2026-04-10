<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
defineProps<{
    title?: string
    message: string
    confirmLabel?: string
}>()

defineEmits<{
    confirm: []
    cancel: []
}>()
</script>

<template>
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md font-sans">

        <!-- Header -->
        <div class="flex items-center justify-between pb-5">
            <h2 class="headline-4 text-black">{{ title ?? 'Booking Confirmation' }}</h2>
            <button @click="$emit('cancel')" class="text-brand-gray-300 hover:text-brand-gray-500 text-2xl cursor-pointer">
                ✕
            </button>
        </div>

        <hr class="border-brand-gray-100 mb-5 -mx-6" />

        <p class="body-2 text-gray-400 font-bold mb-7">{{ message }}</p>

        <div class="flex items-center justify-between mt-2">
            <Button @click="$emit('cancel')"
                variant="secondary"
                class="cursor-pointer rounded-full">
                Cancel
            </Button>
            <Button @click="$emit('confirm')"
                variant="primary"
                class="cursor-pointer rounded-full">
                {{ confirmLabel ?? "Yes, I'm sure" }}
            </Button>
        </div>
    </div>
</template>
