<script setup lang="ts">
defineProps<{
    step: number
    label: string
    status?: 'inactive' | 'active' | 'done'  // default = inactive
    size?: 'lg' | 'sm' // default = lg
}>()
</script>

<template>
    <div class="flex items-center gap-3">
        <!-- วงกลมตัวเลข -->
        <div :class="[
            'rounded-full flex items-center justify-center font-bold shrink-0',
            // size
            size === 'sm' ? 'w-7 h-7 text-sm' : 'w-14 h-14 text-xl',
            // status color
            status === 'active' ? 'bg-brand-orange-700 text-white' :
                status === 'done' ? 'bg-brand-black text-brand-orange-700' :
                    'bg-brand-gray-100 text-brand-gray-500'
        ]">
            {{ step }}
        </div>

        <!-- Label -->
        <span :class="[
            'font-bold',
            size === 'sm' ? 'body-3' : 'body-1',
            status === 'active' ? 'text-brand-orange-700' : 'text-brand-gray-700'
        ]">
            {{ label }}
        </span>
    </div>
</template>