<script setup lang="ts">
import { ref , watch } from 'vue'
import { UserRound } from 'lucide-vue-next';

const props = defineProps<{
    variant?: 'square' | 'circle'  // default = square
    initialImage?: string
}>()

const emit = defineEmits<{
    (e: 'update:file', file: File | null): void
}>()

const previewUrl = ref<string | null>(props.initialImage || null)

watch(() => props.initialImage, (newVal) => {
    if (newVal) previewUrl.value = newVal
})

function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    previewUrl.value = URL.createObjectURL(file)
    emit('update:file', file)
}

function removeImage() {
    previewUrl.value = null
    emit('update:file', null)
}
</script>

<template>
    <!-- ===== SQUARE VARIANT ===== -->
    <template v-if="variant !== 'circle'">
        <!-- ยังไม่มีรูป: แสดงปุ่ม upload -->
        <label v-if="!previewUrl" class="w-44 h-44 flex flex-col items-center justify-center gap-5 
             bg-brand-orange-50 rounded-2xl cursor-pointer 
             hover:bg-brand-orange-100 transition">
            <div class="w-10 h-10 rounded-full border-5 border-brand-orange-700 
                  flex items-center justify-center text-brand-orange-700 text-4xl font-bold">
                +
            </div>
            <span class="body-2 text-brand-orange-700 font-bold">Upload Image</span>
            <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <!-- มีรูปแล้ว: แสดง preview + ปุ่ม X -->
        <div v-else class="relative w-44 h-44">
            <img :src="previewUrl" class="w-full h-full object-cover rounded-2xl" />
            <button @click="removeImage" class="absolute -top-2 -right-2 w-7 h-7 rounded-full 
               bg-brand-gray-500 text-white text-sm flex items-center justify-center
               hover:bg-brand-gray-700 transition">
                ✕
            </button>
        </div>
    </template>

    <!-- ===== CIRCLE VARIANT ===== -->
    <template v-else>
        <div class="relative w-44 h-44">
            <!-- รูป หรือ placeholder -->
            <div class="w-full h-full rounded-full overflow-hidden bg-brand-gray-100 
                  flex items-center justify-center">
                <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
                <!-- placeholder icon -->
                <UserRound class="w-20 h-20 text-brand-white" />
            </div>

            <!-- ปุ่ม + วงกลมด้านล่างขวา -->
            <label
                class="absolute -bottom-1 right-1 w-12 h-12 rounded-full bg-brand-orange-50 text-brand-orange-700 flex items-center justify-center cursor-pointer text-4xl font-base hover:bg-brand-orange-100 transition">
                +
                <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </label>
        </div>
    </template>
</template>
