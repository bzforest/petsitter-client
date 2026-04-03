import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const sitterId = ref<number | null>(null)
  const date = ref<string>('')
  const startTime = ref<string>('')
  const endTime = ref<string>('')
  
  // Step 1: Pet selection
  const selectedPetIds = ref<number[]>([])
  
  // Step 2: Information
  const userName = ref<string>('')
  const email = ref<string>('')
  const phone = ref<string>('')
  const additionalMessage = ref<string>('')

  // Action to initialize booking
  const setBookingDateTime = (sId: number, d: string, st: string, et: string) => {
    sitterId.value = sId
    date.value = d
    startTime.value = st
    endTime.value = et
  }

  // Clear data
  const resetBooking = () => {
    sitterId.value = null
    date.value = ''
    startTime.value = ''
    endTime.value = ''
    selectedPetIds.value = []
    userName.value = ''
    email.value = ''
    phone.value = ''
    additionalMessage.value = ''
  }

  return {
    sitterId,
    date,
    startTime,
    endTime,
    selectedPetIds,
    userName,
    email,
    phone,
    additionalMessage,
    setBookingDateTime,
    resetBooking
  }
})
