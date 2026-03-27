<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    reviewerName: string;
    date: string;
    rating: number;
    comment: string;
    avatarUrl?: string;
}>() , {
    rating: 5,
    //  ใช้รูป Default เป็นโทนสีเขียวให้เข้ากับทีม
    avatarUrl: 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff'
})
</script>

<template>
    <div class="py-6 border-b border-brand-gray-200 last:border-0 flex flex-col md:flex-row gap-4 md:gap-8">

        <div class="flex items-start gap-4 md:w-[200px] shrink-0">
            <img 
                :src="avatarUrl"
                :alt="reviewerName"
                class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex flex-col mt-1">
                <span class="headline-4 text-brand-gray-900">
                    {{ reviewerName }}
                </span>
                <span class="body-3 text-brand-gray-500">
                    {{ date }}
                </span>
            </div>
        </div> 
        <div class="flex flex-col gap-3 flex-1">

            <div class="flex gap-1">
                <template v-for="index in 5" :key="index">
                    <Star 
                        class="w-5 h-5 transition-colors"
                        :class="{
                                    /* ดาวสีเขียว (ได้คะแนน) */
                                    'text-brand-green-500 fill-brand-green-500': index <= rating,

                                    /* ดาวสีเทา (ไม่ได้คะแนน) เปลี่ยนเป็นทึบเทา 300 ทั้งขอบและข้างใน */
                                    'text-brand-gray-300 fill-brand-gray-300': index > rating
                                }"
                    />
                </template>
            </div>

            <p class="body-2 text-brand-gray-700 leading-relaxed">
                {{ comment }}
            </p>

        </div>
        </div>
</template>