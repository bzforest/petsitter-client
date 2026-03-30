<script setup lang="ts">
import { ref } from 'vue';
import InputField from './InputField.vue';
import SelectField from './SelectField.vue';
import MultiSelectField from './MultiSelectField.vue'
import TextareaField from './TextareaField.vue'
import DatePickerField from './DatePickerField.vue'

// สร้างตัวแปรจำลองข้อมูลตัวเลือก (Options) และตัวแปรเก็บค่าที่ถูกเลือก
const sampleOptions = [
    { label: 'Dog' , value: 'dog' },
    { label: 'Cat' , value: 'cat' },
    { label: 'Bird' , value: 'bird' },
    { label: 'Rabbit' , value: 'rabbit' },
]
const testDropdown = ref('')

// สร้างตัวแปรมาเก็ฐค่าที่พิมพ์ (เพื่อให้เห็นภาพว่า v-model ทำงานยังไง)
const testValue = ref('')
const testMultiSelect = ref([])
const testTextarea = ref('')
const testDate = ref('')
</script>

<template>
    <div class="pt-8">
        <h3 class="headline-3 text-brand-gray-900 mb-6">3. Input Field</h3>

        <div class="bg-brand-white p-8 rounded-xl border border-brand-gray-100">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                <div class="space-y-8">
                    <SelectField
                        label="Dropdown"
                        placeholder="Place Holder"
                        :options="sampleOptions"
                        v-model="testDropdown"
                    />
                    <p class=" text-brand-gray-500 -mt-6 text-xs">
                        ค่าที่เลือกอยู่: {{ testDropdown }}
                    </p>
                </div>

                <div class="space-y-8">
                    <InputField 
                        label="Normal"
                        placeholder="Place Holder"
                        v-model="testValue"
                    />
                    <p class=" text-brand-gray-500 -mt-6 text-xs">
                        ค่าที่พิมพ์อยู่: {{ testValue }}
                    </p>
                </div>

                <div class="space-y-8">
                    <MultiSelectField 
                        label="Multi Select"
                        placeholder="Place Holder"
                        :options="sampleOptions"
                        v-model="testMultiSelect"
                    />
                    <p class="text-brand-gray-500 -mt-6 text-xs">
                        ค่าที่เลือกอยู่: {{ testMultiSelect }}
                    </p>
                </div>

                <div class="space-y-8">
                    <InputField 
                        label="Focus"
                        placeholder="Place Holder"
                    />

                    <InputField 
                        label="Success"
                        status="success"
                        placeholder="Place Holder"
                    />

                    <InputField 
                        label="Error"
                        status="error"
                        placeholder="Place Holder"
                    />

                    <InputField 
                        label="Disable"
                        disabled
                        placeholder="Place Holder"
                    />
                </div>

                <div class="space-y-8">
                    <DatePickerField 
                        label="Date Picker"
                        v-model="testDate"
                    />
                    <p class="text-brand-gray-500 -mt-6 text-xs">
                        วันที่เลือก: {{ testDate || 'ยังไม่ได้เลือก' }}
                    </p>
                </div>

                <div class="space-y-8">
                    <TextareaField
                        label="Normal (Textarea)"
                        placeholder="Plave Holder"
                        v-model="testTextarea"
                    />  
                </div>

            </div>
        </div>
    </div>
</template>