<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    currentPage: number;
    totalPages: number;
}>() , {
    currentPage: 1,
    totalPages: 10
})

const emit = defineEmits<{
    (e: 'update:currentPage' , page: number): void
}>()

// ฟังก์ชั่นเปลี่ยนหน้า
const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
        emit('update:currentPage' , page)
    }
}

//  คำนวณเลขหน้า เพื่อการแสดงจุดไข่ปลา ... เวลาหน้าเยอะๆ
const PageNumbers = computed(() => {
    const current = props.currentPage
    const total = props.totalPages

    // ถ้ามีแค่ 5 หน้า หรือน้อยกว่า ให้โชว์เลขทั้งหมดเลย
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    // ถ้าอยู่หน้าแรกๆ (1, 2, 3) -> โชว์ 1 2 3 4 ... หน้าสุดท้าย
    if (current <= 3) {
        return [1, 2, 3, 4,'...', total]
    }

    // ถ้าอยู่หน้าท้ายๆ -> โชว์ หน้าแรก ... 7 8 9 10
    if (current >= total - 2) {
        return [1, '...', total - 3, total -2 , total -1 , total]
    }

    // ถ้าอยู่ตรงกลาง -> โชว์ หน้าแรก ... หน้าก่อนหน้า ปัจจุบัน หน้าถัดไป ... หน้าสุดท้าย
    return [1, '...' , current -1, current, current + 1, '...', total]
})
</script>

<template>
    <nav class="flex items-center justify-center gap-1">

        <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors text-brand-gray-900 hover:bg-brand-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <ChevronLeft class="w-5 h-5"/>
        </button>

        <template v-for="(page , index) in PageNumbers" :key="index">

            <div v-if="page === '...'" class="flex items-center justify-center w-10 h-10 text-brand-gray-500">
                <MoreHorizontal class="w-5 h-5" />
            </div>

            <button
            v-else
            @click="goToPage(page as number)"
            class="flex items-center justify-center w-8 h-8 rounded-full body-2 transition-colors cursor-pointer"
            :class="{
                /* หน้าปัจจุบัน (Active): ขอบส้ม พื้นหลังส้มอ่อน */
                'border-brand-orange-700 bg-brand-orange-50 text-brand-orange-700 font-bold': currentPage === page,
                /* หน้าอื่นๆ: ขอบใส พื้นหลังขาว ตอน Hover ค่อยมีสี */
                'border-transparent bg-transparent text-brand-gray-900 hover:bg-brand-gray-50': currentPage !== page
            }"
            >
                {{ page }}
            </button>

        </template>

        <button
            @click="goToPage(currentPage +1)"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors text-brand-gray-900 hover:bg-brand-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            <ChevronRight class="w-5 h-5" />
        </button>

    </nav>
</template>