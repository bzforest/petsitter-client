<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next'
    // กำหนด props: สิ่งที่หน้าลหักสามารถตั้งค่าได้
    const props = withDefaults(defineProps<{
        label: string;        // ชื่อหัวข้อด้านบน
        placeholder?: string;
        type?: string;
        status?: 'normal' | 'success' | 'error' ;
        disabled?: boolean;
        modelValue?: string;   //  ค่าที่เชื่อมกับ v-model
        min?: string | number;
        max?: string | number;
        step?: string | number;
        maxlength?: string | number;
        inputmode?: 'text' | 'search' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
        autocomplete?: string;
    }>(), {
        // ค่าเริ่มต้น ถ้าค่าหลักไม่ส่งมา จะใช้ค่าพวกนี้แทน
        type: 'text',
        status: 'normal',
        disabled: false,
        placeholder: 'Place Holder'
    })

    // กำหนด Emits: ช่องทางส่งข้อมูลกลับไปให้หน้าหลักเวลาคนพิมพ์
    const emit = defineEmits<{
        (e: 'update:modelValue' , value: string): void
    }>()


    //ฟังก์ชันดักจับเวลาคนพิมพ์ แล้วส่งค่ากลับไป
    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement
        emit('update:modelValue' , target.value)
    }
</script>

<template>
    <div class="flex flex-col gap-2">

        <label class="body-2 text-brand-gray-900 font-bold">
            {{ label }}
        </label>

        <div class="relative">
            <input 
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :min="min"
                :max="max"
                :step="step"
                :maxlength="maxlength"
                :inputmode="inputmode"
                :autocomplete="autocomplete"
                :value="modelValue"
                @input="handleInput"
                class="w-full px-4 py-3 rounded-xl border outline-none body-2 transition-colors duration-200"
                :class="{
                    /* สถานะปกติ  (และตอนคลิก Focus ให้ขอบเป็นสีส้ม) */
                    'border-brand-gray-100 bg-brand-white text-brand-gray-900 placeholder:text-brand-gray-300 hover:border-brand-gray-300 focus:border-brand-orange-700' : status === 'normal' && !disabled,

                    /* 2. สถานะสำเร็จ (ขอบสีเขียว) */
                    'border-brand-green-500 bg-brand-white text-brand-gray-900 focus:border-brand-green-500' : status === 'success' && !disabled,

                    /* 3. สถานะผิดพลาด (ขอบสีแดง ตัวหนังสือสีแดง) */
                    'border-brand-red-500 bg-brand-white text-brand-red-500 placeholder:text-brand-red-500 focus:border-brand-red-500' : status === 'error' && !disabled,

                    /* 4. สถานะปิดใช้งาน (พื้นหลังเทา กดไม่ได้) */
                    'border-brand-gray-100 bg-brand-gray-50 text-brand-gray-300 cursor-not-allowed' : disabled
                }"
            />

            <div v-if="status === 'error'" class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-red-500">
             <CircleAlert class="w-5 h-5" />
            </div>

        </div>
    </div>
</template>