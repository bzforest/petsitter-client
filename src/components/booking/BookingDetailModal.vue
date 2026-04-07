<script setup lang="ts">
import { computed } from 'vue'
import { X, MapPin, SquarePen } from 'lucide-vue-next'
import Badge from '../ui/Badge.vue'

interface Booking {
  id: number;
  sitterId: number;
  sitterName: string;
  petNames: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

const props = defineProps<{
  booking: Booking;
  canChange: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open-change'): void;
}>()

// Map status to badge props
const badgeProps = computed(() => {
  if (props.booking.status === "CANCELLED") return { label: 'Cancelled', color: 'red' as const };
  if (props.booking.status === "COMPLETED") return { label: 'Success', color: 'green' as const };
  
  const now = new Date();
  const start = new Date(`${props.booking.startDate}T${props.booking.startTime}+07:00`);
  
  // Logic for Auto-Cancellation (if less than 1 hour before start and still not confirmed)
  const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1 && (props.booking.status === "PENDING" || props.booking.status === "PAID")) {
    return { label: 'Cancelled', color: 'red' as const };
  }

  // Logic for In Service
  if (now >= start && props.booking.status === "CONFIRMED") {
    return { label: 'In Service', color: 'blue' as const };
  }

  // Standard statuses
  switch (props.booking.status) {
    case "PENDING":
      return { label: 'Waiting for confirm', color: 'pink' as const }
    case "PAID":
      return { label: 'Waiting for confirm', color: 'pink' as const }
    case "CONFIRMED":
      return { label: 'Confirmed', color: 'blue' as const }
    default:
      return { label: props.booking.status, color: 'gray' as const }
  }
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  return timeStr.split(":").slice(0, 2).join(":");
};
</script>

<template>
  <div class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
    <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-brand-gray-50">
        <h3 class="headline-3 text-brand-gray-600">Booking Detail</h3>
        <button @click="emit('close')" class="text-brand-gray-400 hover:text-brand-gray-600 transition cursor-pointer">
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-8 space-y-6">
        
        <!-- Status & Transaction -->
        <div class="space-y-3">
          <Badge :label="badgeProps.label" variant="status" :color="badgeProps.color" />
          
          <div class="space-y-1">
            <p class="body-2 text-brand-gray-300">Transaction date: {{ formatDate(booking.startDate) }}</p>
            <p class="body-2 text-brand-gray-300">Transaction No. : #{{ booking.id }}</p>
          </div>
        </div>

        <!-- Sitter -->
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="body-3 text-brand-gray-500 font-bold uppercase tracking-wider">Pet Sitter:</p>
            <h4 class="headline-3 text-brand-gray-700">{{ booking.sitterName }}</h4>
          </div>
          <button class="flex items-center gap-2 text-brand-orange-500 font-bold hover:text-brand-orange-600 transition cursor-pointer">
            <MapPin class="w-4 h-4" />
            <span class="body-3">View Map</span>
          </button>
        </div>

        <!-- Date & Time -->
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="body-3 text-brand-gray-500 font-bold uppercase tracking-wider">Date & Time:</p>
            <p class="body-2 text-brand-gray-700 font-bold">
              {{ formatDate(booking.startDate) }} | {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}
            </p>
          </div>
          <button 
            v-if="canChange"
            @click="emit('open-change')"
            class="flex items-center gap-2 text-brand-orange-500 font-bold hover:text-brand-orange-600 transition cursor-pointer"
          >
            <SquarePen class="w-4 h-4" />
            <span class="body-3">Change</span>
          </button>
        </div>

        <!-- Duration -->
        <div class="space-y-1">
          <p class="body-3 text-brand-gray-500 font-bold uppercase tracking-wider">Duration:</p>
          <p class="body-2 text-brand-gray-700 font-bold">{{ (booking as any).totalHours || 0 }} hours</p>
        </div>

        <!-- Pets -->
        <div class="space-y-1 pb-4 border-b border-brand-gray-50">
          <p class="body-3 text-brand-gray-500 font-bold uppercase tracking-wider">Pet:</p>
          <p class="body-2 text-brand-gray-700 font-bold">{{ booking.petNames.join(', ') }}</p>
        </div>

        <!-- Total Price -->
        <div class="flex items-center justify-between">
          <span class="headline-3 text-brand-gray-900 uppercase">Total</span>
          <span class="headline-2 text-brand-gray-900">{{ booking.totalPrice }} <span class="text-sm font-normal">THB</span></span>
        </div>
      </div>

    </div>
  </div>
</template>
