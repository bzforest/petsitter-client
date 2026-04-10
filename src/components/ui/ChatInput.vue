<script setup lang="ts">
import { Image, Send, X } from 'lucide-vue-next'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: string;
    placeholder?: string;
}>() , {
    modelValue: '',
    placeholder: 'Message here...'
})

const emit = defineEmits<{
    (e: 'update:modelValue' , value: string): void;
    //  ให้แนบไฟล์ไปด้วย (ถ้ามี)
    (e: 'send' , message: string, file: File | null): void; 
}>()

// สร้างตัวแปรไว้จับ <input type="file"> ที่เราจะซ่อนไว้
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// ฟังก์ชันสั่งให้เปิดหน้าต่างเลือกไฟล์
const triggerFileInput = () => {
    fileInput.value?.click()
}

//  เมื่อเลือกรูป ให้เอามาโชว์ Preview แทนการส่งออกไปทันที
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file); // สร้าง URL จำลองเพื่อโชว์ภาพ
        target.value = ''; 
    }
}

// ฟังก์ชันลบรูปที่เลือกไว้
const removeImage = () => {
    selectedFile.value = null;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
}

// ฟังก์ชันกดส่งข้อความ
const handleSend = () => {
    const hasText = props.modelValue && props.modelValue.trim() !== '';
    const hasImage = selectedFile.value !== null;

    if(hasText || hasImage) {
        emit('send' , props.modelValue || '', selectedFile.value)
        removeImage() // ส่งเสร็จแล้ว ลบรูป preview ออก
        emit('update:modelValue', '') // ล้างช่องพิมพ์ข้อความ
    }
}
</script>

<template>
  <div class="flex flex-col w-full bg-white border-t border-brand-gray-100 p-4">
    
    <div v-if="previewUrl" class="mb-3 relative inline-block w-24 h-24 md:w-32 md:h-32 self-start ml-2 rounded-xl overflow-hidden shadow-sm border border-brand-gray-200">
      <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
      <button @click="removeImage" class="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1 transition cursor-pointer">
        <X class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-center gap-3 md:gap-4 w-full relative">
      <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />

      <button @click="triggerFileInput" class="text-brand-gray-400 hover:text-brand-gray-600 transition-colors shrink-0">
        <Image class="w-7 h-7 md:w-9 md:h-9 md:p-2 p-1 text-brand-gray-700 bg-brand-gray-100 rounded-full cursor-pointer hover:scale-105" />
      </button>
  
      <input 
        type="text" 
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="handleSend"
        :placeholder="placeholder"
        class="flex-1 bg-transparent border-none outline-none body-2 text-brand-gray-900 placeholder:text-brand-gray-300 min-w-0"
      />
  
      <button 
        @click="handleSend"
        :disabled="(!modelValue || modelValue.trim() === '') && !selectedFile"
        class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange-700 hover:bg-brand-orange-600 text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:cursor-pointer"
      >
        <Send class="w-4 h-4 md:w-5 md:h-5 ml-0.5 md:ml-1" />
      </button>
    </div>

  </div>
</template>