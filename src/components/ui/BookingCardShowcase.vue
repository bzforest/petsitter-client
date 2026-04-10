<script setup lang="ts">
import BookingCard from './BookingCard.vue'
</script>

<template>
    <div class="pt-8">
        <h3 class="headline-3 text-brand-gray-900 mb-6">6. Booking Card</h3>

        <div class="p-2  md:p-4 rounded-xl flex flex-col gap-8 max-w-[876px] mx-auto">

            <BookingCard 
                sitterName="Happy House!"
                ownerName="Jane Maison"
                transactionDate="Tue, 16 Aug 2023"
                status="waiting"
                bookingDate="25 Aug, 2023"
                bookingTime="7 AM - 10 AM"
                duration="3 hours"
                petName="Mr.Ham , Bingsu"
            />

            <BookingCard 
                sitterName="Happy House!"
                ownerName="Jane Maison"
                transactionDate="Tue, 16 Aug 2023"
                status="in_service"
                bookingDate="25 Aug, 2023"
                bookingTime="7 AM - 10 AM"
                duration="3 hours"
                petName="Mr.Ham , Bingsu"
            />

            <BookingCard 
                sitterName="Happy House!"
                ownerName="Jane Maison"
                transactionDate="Tue, 16 Aug 2023"
                status="success"
                bookingDate="25 Aug, 2023"
                bookingTime="7 AM - 10 AM"
                duration="3 hours"
                petName="Mr.Ham, Bingsu"
                successDate="Tue, 25 Oct 2022 | 11:03 AM"
                :isReviewed="false" 
            />

            <BookingCard 
                sitterName="Happy House!"
                ownerName="Jane Maison"
                transactionDate="Tue, 16 Aug 2023"
                status="success"
                bookingDate="25 Aug, 2023"
                bookingTime="7 AM - 10 AM"
                duration="3 hours"
                petName="Mr.Ham, Bingsu"
                successDate="Tue, 25 Oct 2022 | 11:03 AM"
                :isReviewed="true"
            />

        </div>
    </div>
</template>