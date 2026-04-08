<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, X } from 'lucide-vue-next'
import { useBookingStore } from '@/stores/bookingStore'
import Button from '../ui/Button.vue'
import DatePickerField from '../ui/DatePickerField.vue'
import SelectField from '../ui/SelectField.vue'

const props = withDefaults(defineProps<{
  sitterId: number;
  mode?: 'create' | 'update';
  isSubmitting?: boolean;
}>(), {
  mode: 'create',
  isSubmitting: false
})

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>()

const router = useRouter()
const bookingStore = useBookingStore()

// Generate time options (8:00 AM to 8:00 PM)
const generateTimeOptions = () => {
  const options = []
  const startHour = 8
  const endHour = 20
  for (let i = startHour; i <= endHour; i++) {
    const ampm = i >= 12 ? 'PM' : 'AM'
    const hr12 = i > 12 ? i - 12 : (i === 0 ? 12 : i)
    const valHour = i.toString().padStart(2, '0')

    options.push({ label: `${hr12}:00 ${ampm}`, value: `${valHour}:00` })
    
    if (i !== endHour) {
      options.push({ label: `${hr12}:30 ${ampm}`, value: `${valHour}:30` })
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

// Get today's date as YYYY-MM-DD in local time
const minDate = new Date().toLocaleDateString('en-CA') // en-CA gives YYYY-MM-DD format

// Local state for the form inputs
const date = ref('')
const startTime = ref('')
const endTime = ref('')
const formError = ref('')

// Filter time options to show only future times if today is selected
const filteredTimeOptions = computed(() => {
  if (date.value !== minDate) return timeOptions

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  return timeOptions.filter((opt) => {
    const [h, m] = opt.value.split(':').map(Number)
    return h > currentHour || (h === currentHour && m > currentMinute)
  })
})

// Filter end time options to be after start time
const filteredEndTimeOptions = computed(() => {
  if (!startTime.value) return filteredTimeOptions.value

  const [startH, startM] = startTime.value.split(':').map(Number)
  
  return filteredTimeOptions.value.filter(opt => {
    const [h, m] = opt.value.split(':').map(Number)
    return h > startH || (h === startH && m > startM)
  })
})

// Watcher to reset endTime if it's no longer valid
watch(startTime, (newStart) => {
  if (newStart && endTime.value) {
    const [sH, sM] = newStart.split(':').map(Number)
    const [eH, eM] = endTime.value.split(':').map(Number)
    
    // If start time is after or equal to end time, reset end time
    if (sH > eH || (sH === eH && sM >= eM)) {
      endTime.value = ''
    }
  }
})

// Watcher to reset all times if the date changes
watch(date, () => {
  startTime.value = ''
  endTime.value = ''
})

const handleContinue = () => {
  formError.value = ''
  if (!date.value || !startTime.value || !endTime.value) {
    formError.value = 'Please select both a date and a time range.'
    return
  }

  const [startH, startM] = startTime.value.split(':').map(Number)
  const [endH, endM] = endTime.value.split(':').map(Number)
  if (endH < startH || (endH === startH && endM <= startM)) {
    formError.value = 'End time must be after start time.'
    return
  }
  
  // Save to Pinia Store
  bookingStore.setBookingDateTime(props.sitterId, date.value, startTime.value, endTime.value)
  
  if (props.mode === 'update') {
    emit('confirm')
  } else {
    // Navigate to full page booking flow
    router.push(`/sitter/${props.sitterId}/booking`)
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-brand-gray-100">
        <h3 class="headline-3 text-brand-gray-600">{{ mode === 'update' ? 'Update Booking' : 'Booking' }}</h3>
        <button 
          @click="$emit('close')" 
          :disabled="isSubmitting"
          :class="[isSubmitting ? 'opacity-30 cursor-not-allowed' : 'hover:text-brand-gray-700 cursor-pointer']"
          class="text-brand-gray-500 transition"
        >
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6">
        <p class="body-1 text-brand-gray-500 mb-6">Select date and time you want to schedule the service.</p>
        
        <div class="flex flex-col gap-5" :class="{'opacity-60 pointer-events-none': isSubmitting}">
          <!-- Date Field -->
          <div class="relative">
            <DatePickerField
            label="Date"
            type="date"
            v-model="date"
            :min="minDate"
            class="cursor-pointer"
            />
          </div>

          <!-- Time Fields -->
          <div class="flex justify-center items-center gap-3 w-full">
            <div class="w-10 flex items-center justify-center">
              <Clock class="w-6 h-6 text-brand-gray-300" />
            </div>
            
            <div class="flex-1">
              <SelectField 
                placeholder="--:--"
                :options="filteredTimeOptions"
                v-model="startTime"
              />
            </div>
            
            <span class="text-brand-gray-300">-</span>
            
            <div class="flex-1">
              <SelectField 
                placeholder="--:--"
                :options="filteredEndTimeOptions"
                v-model="endTime"
              />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="formError" class="body-3 text-red-500 mt-4 text-center">{{ formError }}</p>

        <!-- Continue Button -->
        <Button 
          :disabled="!date || !startTime || !endTime || isSubmitting"
          :loading="isSubmitting"
          @click="handleContinue" 
          variant="primary"
          class="w-full mt-4 rounded-full cursor-pointer"
        >
          {{ mode === 'update' ? 'Update' : 'Continue' }}
        </Button>
      </div>

    </div>
  </div>
</template>
