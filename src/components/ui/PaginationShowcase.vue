<script setup lang="ts">
import { ref } from 'vue'
import PaginationField from './PaginationField.vue'

// สร้างตัวแรปมาเก็ยหน้าปัจจุบัน เริ่มต้นที่หน้า 1
const activePage = ref(1)
</script>

<template>
    <div class="pt-8">
        <h3 class="headline-3 text-brand-gray-900 mb-6">4. Pagination</h3>

        <div class="bg-brand-white p-8 rounded-xl border border-brand-gray-100 flex flex-col items-center justify-center gap-6">

            <PaginationField 
                :totalPages="10"
                v-model:current-page="activePage"
            />

            <p class="body-2 text-brand-gray-500"></p>
            กำลังแสดงข้อมูลของหน้าที่: <span class="font-bold text-brand-orange-700">{{ activePage }}</span>
        
        </div>
    </div>
</template>