<script setup lang="ts">
import ReviewCard from './ReviewCard.vue'

const mockReviews = [
    {
        id: 1,
        reviewerName: 'Best Sakditat',
        date: '15 jan 2026',
        rating: 5,
        comment: 'พี่ Pet Sitter ดูแลน้องหมาดีมากๆ ครับ คอยส่งรูปอัปเดตให้ดูตลอดเวลาที่ผมไม่อยู่ ประทับใจมาก จะใช้บริการอีกแน่นอนครับ' ,
        avatarUrl: 'https://ui-avatars.com/api/?name=Best&background=E44A0C&color=fff'
    },
    {
        id: 2,
        reviewerName: 'Champion 888',
        date: '10 jan 2026',
        rating: 4,
        comment: 'ดูแลน้องแมวดี น้องดูไม่เครียด พี่เลี้ยงน่าจะเครียดแทน พี่เลี้ยงน่าจะเครียดแทน พี่เลี้ยงน่าจะเครียดแทน พี่เลี้ยงน่าจะเครียดแทน',
        avatarUrl: 'https://ui-avatars.com/api/?name=Champion&background=5B5D6F&color=fff'
    },
    {
        id: 3,
        reviewerName: 'Job Jab',
        date: '23 NOV 2026',
        rating: 3,
        comment: 'ถ้าสนุกเดี๋ยวกลับมาเพิ่มดาวให้ ถ้าสนุกเดี๋ยวกลับมาเพิ่มดาวให้ ถ้าสนุกเดี๋ยวกลับมาเพิ่มดาวให้ ถ้าสนุกเดี๋ยวกลับมาเพิ่มดาวให้',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jab&background=5B5D6F&color=fff'
    },
    {
        id: 4,
        reviewerName: 'Foy JR.',
        date: '16 Oct 2026',
        rating: 2,
        comment: 'ถ้าเย็นนี้ถูกหวย ถูกหวย ถูกหวย ถูกหวย ถูกหวย ถูกหวย ถูกหวย เดี๋ยวกลับมาเพิ่มให้ครับ',
        avatarUrl: 'https://ui-avatars.com/api/?name=Foy&background=5B5D6F&color=fff'
    },
    {
        id: 5,
        reviewerName: 'Double Jump',
        date: '11 jan 2026',
        rating: 1,
        comment: 'ยังไม่ได้ลอง ยังไม่ได้ลองยังไม่ได้ลองยังไม่ได้ลองยังไม่ได้ลอง เดี๋ยวลองแล้วกลับมาเพิ่มดาวให้ครับ',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jump&background=5B5D6F&color=fff'
    },
]
</script>

<template>
    <div class="pt-8">
        <h3 class="headline-3 text-brand-gray-900 mb-6">5. Review Card</h3>

        <div class="bg-brand-gray-50 p-8 rounded-xl border border-brand-gray-100">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <ReviewCard 
                    v-for="review in mockReviews"
                    :key="review.id"
                    :reviewerName="review.reviewerName"
                    :date="review.date"
                    :rating="review.rating"
                    :comment="review.comment"
                    :avatarUrl="review.avatarUrl"
                />
            </div>

        </div>
    </div>
</template>