<script setup lang="ts">
// ใช้ defineProps เพื่อบอกว่า Component นี้ต้องการรับข้อมูลอะไรบ้างจากหน้าหลัก
defineProps<{
    color: {
        name: string
        hex: string
        bgClass: string
    }
}>()
</script>

<template>
    <div
        class="relative group w-16 h-16 sm:w-72 sm:h-30 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105 border border-brand-gray-100"
        :class="color.bgClass"
    >
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gray-900 text-brand-white text-xs p-2 rounded-md pointer-events-none z-10 w-max text-center shadow-lg">
            <p class="font-bold">bg-{{ color.name }}</p>
            <p class="font-mono text-brand-gray-300">{{ color.hex }}</p>
        </div>
    </div>
</template>