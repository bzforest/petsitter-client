<script setup lang="ts">
import { computed } from 'vue'
import { Phone, PhoneCall, SquarePen } from 'lucide-vue-next'
import Badge from './Badge.vue'
import Button from './Button.vue'

//  กำหนด Props ให้คลุมทุกข้อมูลในการ์ด
const props = withDefaults(defineProps<{
    sitterName: string;
    ownerName: string;
    transactionDate: string;  // เช่น Tue, 16 Aug 2023
    status: 'waiting' | 'in_service' | 'success';
    bookingDate: string;  // เช่น 25 Aug, 2023
    bookingTime: string;  // เช่น 7 AM - 10 AM
    duration: string;  // เช่น 3 hours
    petName: string;
    successDate?: string;  // วันที่ทำรายการสำเร็จ (โชว์เฉพาะสถานะ success)
    sitterAvatarUrl?: string;
    isReviewed?: boolean;
}>(), {
    sitterAvatarUrl: 'https://ui-avatars.com/api/?name=Sitter&background=F4F5F8&color=1F2937' ,
    isReviewed: false
})

//  Computed Properties สำหรับจัดการสีและข้อความของ Badge ตามสถานะ
const badgeProps = computed(() => {
    switch (props.status) {
        case 'waiting' :
            return { label: 'Waiting for confirm' , color: 'pink' as const}
        case 'in_service' :
            return { label: 'In service' , color: 'blue' as const}
        case 'success' :
            return { label: 'Success' , color: 'green' as const}
        default :
            return { label: 'Unknown' , color: 'gray' as const}
    }
})
</script>

<template>
    <div class="bg-brand-white p-4 md:p-6 rounded-[16px] border border-brand-gray-100 flex flex-col gap-4 md:gap-6 shadow-sm w-full">
      
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        
        <div class="flex items-start gap-4">
          <img :src="sitterAvatarUrl" alt="sitter" class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0" />
          <div class="flex flex-col">
            <span class="headline-4 text-brand-gray-900">{{ sitterName }}</span>
            <span class="body-3 text-brand-gray-900">By {{ ownerName }}</span>
          </div>
        </div>
        
        <div class="flex flex-col items-start md:items-end gap-1">
          <span class="body-3 text-brand-gray-300">Transaction date: {{ transactionDate }}</span>
          <Badge :label="badgeProps.label" variant="status" :color="badgeProps.color" />
        </div>
      </div>
  
      <div class="h-px bg-brand-gray-100 w-full"></div>
  
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        
        <div class="flex flex-col gap-1 md:col-span-6">
          <span class="body-3 text-brand-gray-500">Date & Time:</span>
          
          <div class="flex items-center gap-2 flex-nowrap">
            <span class="body-2 text-brand-gray-900 font-bold whitespace-nowrap">{{ bookingDate }} | {{ bookingTime }}</span>
            
            <button v-if="status === 'waiting'" class="flex items-center gap-1 text-brand-orange-700 hover:text-brand-orange-500 transition-colors shrink-0">
              <SquarePen class="w-4 h-4" />
              <span class="body-3 font-bold">Change</span>
            </button>
          </div>
        </div>
  
        <div class="flex flex-col gap-1 md:col-span-3">
          <span class="body-3 text-brand-gray-500">Duration:</span>
          <span class="body-2 text-brand-gray-900 font-bold truncate">{{ duration }}</span>
        </div>
  
        <div class="flex flex-col gap-1 md:col-span-3">
          <span class="body-3 text-brand-gray-500">Pet:</span>
          <span class="body-2 text-brand-gray-900 font-bold truncate">{{ petName }}</span>
        </div>
        
      </div>
  
    <div 
      v-if="status === 'waiting' || status === 'in_service'" 
      class="bg-brand-gray-50 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2 mt-1 w-full"
    >
      <span class="body-3 text-brand-gray-500 text-left">
        {{ status === 'waiting' ? 'Waiting Pet Sitter for confirm booking' : 'Your pet is already in Pet Sitter care!' }}
      </span>
      
      <div class="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        <Button variant="primary" class="flex-1 md:flex-none">Send Message</Button>
        <Button variant="icon" class="shrink-0">
          <Phone class="w-5 h-5" />
        </Button>
      </div>
    </div>

    <div 
      v-if="status === 'success'" 
      class="bg-brand-green-50 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2 mt-1 w-full"
    >
      <div class="flex flex-col items-start w-full md:w-auto shrink-0">
        <span class="body-3 text-brand-green-500">Success date:</span>
        <span class="body-3 text-brand-green-500 font-bold">{{ successDate }}</span>
      </div>
      
      <div class="flex flex-row items-center justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
        
        <button class="body-3 font-bold text-brand-orange-700 hover:text-brand-orange-500 transition-colors px-2 whitespace-nowrap shrink-0">
          Report
        </button>
        
        <Button 
          :variant="isReviewed ? 'secondary' : 'primary'" 
          class="flex-1 md:flex-none"
        >
          {{ isReviewed ? 'Your Review' : 'Review' }}
        </Button>

        <Button variant="icon" class="shrink-0">
          <Phone class="w-5 h-5" />
        </Button>
      </div>
    </div>
  
    </div>
  </template>