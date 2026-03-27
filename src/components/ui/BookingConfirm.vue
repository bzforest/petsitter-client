<script setup lang="ts">
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
            <button @click="$emit('cancel')" class="text-brand-gray-300 hover:text-brand-gray-500 text-2xl">
                ✕
            </button>
        </div>

        <hr class="border-brand-gray-100 mb-5 -mx-6" />

        <p class="body-2 text-gray-400 font-bold mb-7">{{ message }}</p>

        <div class="flex items-center justify-between mt-2">
            <button @click="$emit('cancel')"
                class="px-6 py-2 rounded-full bg-brand-orange-50 text-brand-orange-700 body-2 font-bold hover:bg-brand-orange-100">
                Cancel
            </button>
            <button @click="$emit('confirm')"
                class="px-6 py-2 rounded-full bg-brand-orange-700 text-brand-white body-2 font-bold hover:bg-brand-orange-900">
                {{ confirmLabel ?? "Yes, I'm sure" }}
            </button>
        </div>
    </div>
</template>
