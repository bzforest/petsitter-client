<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardNumberElement, type StripeCardExpiryElement, type StripeCardCvcElement } from '@stripe/stripe-js'

// 🔑 Stripe Instances
const stripe = ref<Stripe | null>(null)
let elements: StripeElements | null = null

let cardNumber: StripeCardNumberElement | null = null
let cardExpiry: StripeCardExpiryElement | null = null
let cardCvc: StripeCardCvcElement | null = null

const cardOwnerName = ref('')
const errors = ref({
  cardNumber: null as string | null,
  cardExpiry: null as string | null,
  cardCvc: null as string | null
})

const cardNumberComplete = ref(false)
const cardExpiryComplete = ref(false)
const cardCvcComplete = ref(false)

const isComplete = computed(() => {
  return cardNumberComplete.value && 
         cardExpiryComplete.value && 
         cardCvcComplete.value && 
         cardOwnerName.value.trim().length > 0
})

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY

onMounted(async () => {
  stripe.value = await loadStripe(STRIPE_PUBLIC_KEY)
  
  if (stripe.value) {
    elements = stripe.value.elements()
    
    // ตั้งค่าสไตล์พื้นฐานให้เหมือนกับ Input
    const elementStyles = {
      style: {
        base: {
          fontSize: '16px',
          color: '#374151', // brand-gray-600
          fontFamily: 'Inter, sans-serif',
          '::placeholder': { color: '#9CA3AF' },
        },
        invalid: { color: '#EF4444' },
      }
    }

    // Card number
    cardNumber = elements.create('cardNumber', elementStyles)
    cardNumber.mount('#card-number')
    cardNumber.on('change', (e) => {
      errors.value.cardNumber = e.error ? e.error.message : null
      cardNumberComplete.value = e.complete
    })

    // expiry date
    cardExpiry = elements.create('cardExpiry', elementStyles)
    cardExpiry.mount('#card-expiry')
    cardExpiry.on('change', (e) => {
      errors.value.cardExpiry = e.error ? e.error.message : null
      cardExpiryComplete.value = e.complete
    })

    // CVC
    cardCvc = elements.create('cardCvc', elementStyles)
    cardCvc.mount('#card-cvc')
    cardCvc.on('change', (e) => {
      errors.value.cardCvc = e.error ? e.error.message : null
      cardCvcComplete.value = e.complete
    })
  }
})


defineExpose({
  getCardNumber: () => cardNumber,
  getStripe: () => stripe.value,
  getCardOwnerName: () => cardOwnerName.value,
  isComplete
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
    
    <!-- Card Number -->
    <div class="flex flex-col gap-2">
      <label class="body-2 text-brand-gray-900">Card Number*</label>
      <div 
        id="card-number" 
        class="stripe-input-container"
        :class="{'border-red-500': errors.cardNumber}"
      ></div>
      <p v-if="errors.cardNumber" class="body-3 text-red-500">{{ errors.cardNumber }}</p>
    </div>

    <!-- Card Owner -->
    <div class="flex flex-col gap-2">
      <label class="body-2 text-brand-gray-900">Card Owner*</label>
      <input 
        v-model="cardOwnerName"
        type="text" 
        placeholder="Card owner name"
        class="w-full px-5 py-3.5 bg-white border border-brand-gray-100 rounded-2xl focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-100 transition-all outline-none body-1 text-brand-gray-600"
      />
    </div>

    <!-- Expiry Date -->
    <div class="flex flex-col gap-2">
      <label class="body-2 text-brand-gray-900">Expiry Date*</label>
      <div 
        id="card-expiry" 
        class="stripe-input-container"
        :class="{'border-red-500': errors.cardExpiry}"
      ></div>
      <p v-if="errors.cardExpiry" class="body-3 text-red-500">{{ errors.cardExpiry }}</p>
    </div>

    <!-- CVC/CVV -->
    <div class="flex flex-col gap-2">
      <label class="body-2 text-brand-gray-900">CVC/CVV*</label>
      <div 
        id="card-cvc" 
        class="stripe-input-container"
        :class="{'border-red-500': errors.cardCvc}"
      ></div>
      <p v-if="errors.cardCvc" class="body-3 text-red-500">{{ errors.cardCvc }}</p>
    </div>

  </div>
</template>

<style scoped>
.stripe-input-container {
  padding: 14px 20px;
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-color: #E5E7EB;
  border-radius: 16px;
  transition: all 0.3s ease;
  min-height: 52px;
}

/* Stripe classes that are automatically applied */
.stripe-input-container.StripeElement--focus {
  border-color: #F87171; /* arbitrary fallback, will use tailwind-like logic via focus ring */
  box-shadow: 0 0 0 2px #FEE2E2; 
}

/* Since Stripe handles class injection, we use standard CSS or global tailwind for these specialized classes */
:deep(.StripeElement--focus) {
  border-color: #f6752c !important;
  box-shadow: 0 0 0 2px #fef1e8 !important;
}
</style>
