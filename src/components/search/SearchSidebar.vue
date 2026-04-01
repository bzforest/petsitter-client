<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'

// Import จาก Design System 
// 🟢 1. ดึง RatingSelection กลับมาใช้ครับ!
import RatingSelection from '@/components/ui/RatingSelection.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()   
const router = useRouter() 

// 1. ช่องพิมพ์ค้นหา
const searchQuery = ref('')

// 2. สัตว์เลี้ยง
const selectedPetTypes = ref<string[]>([])
const petOptions = ['Dog', 'Cat', 'Bird', 'Rabbit']

// 3. Rating (กลับไปใช้ข้อมูลแบบเดิม และประกาศ Type ให้ถูกต้อง)
const selectedRating = ref<number | null>(null) 
const ratingOptions = [5, 4, 3, 2, 1] 

// 4. Experience
const selectedExperience = ref<string>('0-2 Years')
const expOptions = [
  { label: '0-2 Years', value: '0-2 Years' },
  { label: '3-5 Years', value: '3-5 Years' },
  { label: '5+ Years', value: '5+ Years' }
]

onMounted(() => {
  if (route.query.q) searchQuery.value = route.query.q as string
  
  // แปลง Query กลับมาเป็นตัวเลข (Number) เพื่อให้ตรงกับ Logic ของ RatingSelection
  if (route.query.rating) selectedRating.value = Number(route.query.rating)
  
  if (route.query.exp) selectedExperience.value = route.query.exp as string

  if (route.query.pets) {
    const petsParam = route.query.pets
    selectedPetTypes.value = (Array.isArray(petsParam) ? petsParam : [petsParam]) as string[]
  }
})

const handleClear = () => {
  searchQuery.value = ''
  selectedPetTypes.value = []
  selectedRating.value = null
  selectedExperience.value = '0-2 Years'
}

const handleSearch = () => {
  router.push({
    query: {
      q: searchQuery.value || undefined,
      pets: selectedPetTypes.value.length ? selectedPetTypes.value : undefined,
      rating: selectedRating.value || undefined,
      exp: selectedExperience.value
    }
  })
}
</script>

<template>
  <div class="bg-white rounded-[24px] p-6 flex flex-col gap-6 shadow-2xl w-full max-w-[320px]">
    
    <div class="flex flex-col gap-3">
      <label class="headline-4 text-brand-gray-900 font-bold">Search</label>
      
      <div class="flex items-center w-full border-2 border-brand-gray-100 rounded-xl bg-white px-4 py-2.5 focus-within:border-brand-orange-500 focus-within:ring-2 focus-within:ring-brand-orange-500/20 transition-all">
        
        <input 
            type="text"
            v-model="searchQuery" 
            placeholder="Search..."
            class="grow w-full body-2 bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-brand-gray-900 placeholder:text-brand-gray-300"
        />
        
        <Search class="w-5 h-5 text-brand-gray-300 shrink-0 ml-2 cursor-pointer hover:text-brand-orange-500 transition-colors" />
        
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label class="headline-4 text-brand-gray-900 font-bold">Pet Type:</label>
      <div class="grid grid-cols-2 gap-y-3 gap-x-2">
        <label
            v-for="pet in petOptions"
            :key="pet"
            class="flex items-center gap-2 cursor-pointer group"
        >
            <input 
                type="checkbox"
                :value="pet"
                v-model="selectedPetTypes"
                class="
                  w-5 h-5 rounded cursor-pointer appearance-none transition-all
                  border-2 border-brand-gray-300
                  checked:bg-brand-orange-700 checked:border-brand-orange-500
                  checked:bg-check-white bg-center bg-no-repeat bg-size-16px_16px
                  focus:ring-2 focus:ring-brand-orange-500/20
                "
                style="--tw-bg-check-white: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%2720 6 9 17 4 12%27/%3E%3C/svg%3E')"
            />
            <span class="body-2 text-brand-gray-700 group-hover:text-brand-gray-900 transition-colors">
                {{ pet }}
            </span>
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label class="headline-4 text-brand-gray-900 font-bold">Rating:</label>
      
      <div class="flex flex-col gap-1.5 items-start">
        <RatingSelection 
            v-for="rate in ratingOptions" 
            :key="rate" 
            :rating="rate" 
            v-model="selectedRating"
            class="cursor-pointer hover:scale-105"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label class="headline-4 text-brand-gray-900 font-bold">Experience:</label>
      <SelectField 
          label=""
          v-model="selectedExperience"
          :options="expOptions"
          placeholder="Select Year"
      />
    </div>

    <div class="flex items-center justify-between gap-4 mt-2">
      <Button variant="secondary" @click="handleClear" class="w-full text-brand-orange-500 cursor-pointer">
        Clear
      </Button>
      <Button variant="primary" @click="handleSearch" class="w-full cursor-pointer">
        Search
      </Button>
    </div>

  </div>
</template>

<style scoped>
input[type="checkbox"]:checked {
  background-image: var(--tw-bg-check-white);
}
</style>