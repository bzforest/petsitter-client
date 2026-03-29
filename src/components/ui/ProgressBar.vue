<script setup lang="ts">
import ProgressStep from './ProgressStep.vue'

const props = defineProps<{
    currentStep: number  // 1, 2, 3...
    steps: { label: string }[]
}>()

function getStatus(index: number) {
    const stepNumber = index + 1
    if (stepNumber < props.currentStep) return 'done'
    if (stepNumber === props.currentStep) return 'active'
    return 'inactive'
}
</script>

<template>
    <div class="border border-brand-gray-100 rounded-2xl px-10 py-6 flex  justify-center gap-10">
        <template v-for="(step, index) in steps" :key="index">

            <ProgressStep :step="index + 1" :label="step.label" :status="getStatus(index)" size="lg" />

            <!-- เส้นคั่นระหว่าง step ยกเว้น step สุดท้าย -->
            <div v-if="index < steps.length - 1" class="flex-1 h-px bg-brand-gray-300" />

        </template>
    </div>
</template>