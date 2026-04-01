<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Import Component จาก Design System มาใช้ให้ครบ!
import RatingSelection from '@/components/ui/RatingSelection.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Button from '@/components/ui/Button.vue'

// --- เฟส 1: สัตว์เลี้ยง ---
const selectedPetTypes = ref<string[]>([])
const petOptions = ['Dog', 'Cat', 'Bird', 'Rabbit']

// --- เฟส 2: ตัวกรองการค้นหา ---
const selectedRating = ref<number | null>(null)
const ratingOptions = [5, 4, 3, 2, 1] 

const selectedExperience = ref<string>('0-2 Years')
// 💡 ปรับ Array ให้เป็น Object ตามที่ SelectField ต้องการ
const expOptions = [
  { label: '0-2 Years', value: '0-2 Years' },
  { label: '3-5 Years', value: '3-5 Years' },
  { label: '5+ Years', value: '5+ Years' }
]

const router = useRouter()

const handleClear = () => {
  selectedPetTypes.value = []
  selectedRating.value = null
  selectedExperience.value = '0-2 Years'
}

const handleSearch = () => {
  // สั่งเปลี่ยนหน้าไปที่ /search (หรือ path ที่พี่ Foy ตั้งไว้) พร้อมแนบ Query
  router.push({
    path: '/search', 
    query: {
      pets: selectedPetTypes.value, // Vue Router จะจัดการแปลง Array ให้เอง (เจ๋งมาก)
      rating: selectedRating.value,
      exp: selectedExperience.value
    }
  })
}

</script>

<template>
  <div class="bg-white rounded-[24px] shadow-xl border border-brand-gray-100 w-full flex flex-col">
    
    <div class="bg-brand-gray-50 rounded-t-[24px] px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center gap-4 border-b border-brand-gray-100">
        
        <span class="headline-4 text-brand-gray-900 min-w-[80px]">Pet Type:</span>

        <div class="flex items-center gap-4 md:gap-8 flex-wrap">
            
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
                <span class="body-2 text-brand-gray-700 group-hover:text-brand-gray-900 transition-colors scale-110">
                    {{ pet }}
                </span>
            </label>
        </div>
    </div>

    <div class="bg-white px-6 py-5 md:px-8 md:py-6 flex flex-row flex-wrap items-start xl:items-center justify-start xl:justify-between gap-x-8 gap-y-6 rounded-[24px]">
        
        <div class="flex flex-col lg:flex-row lg:items-center gap-4 shrink-0 w-full xl:w-auto">
            <span class="headline-4 text-brand-gray-900 whitespace-nowrap">Rating:</span>
            
            <div class="flex items-center gap-2 flex-wrap">
                <RatingSelection 
                    v-for="rate in ratingOptions" 
                    :key="rate" 
                    :rating="rate" 
                    v-model="selectedRating"
                    class="cursor-pointer hover:scale-105" 
                />
            </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shrink-0 w-full xl:w-auto mt-2 xl:mt-0">
            
            <div class="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                <span class="headline-4 text-brand-gray-900 whitespace-nowrap">Experience:</span>
                <div class="w-[160px]">
                    <SelectField 
                        label=""
                        v-model="selectedExperience"
                        :options="expOptions"
                        placeholder="Select Year"
                    />
                </div>
            </div>

            <Button variant="secondary" @click="handleClear" class="w-full text-brand-orange-500 cursor-pointer">
        Clear
      </Button>

            <Button
                variant="primary" 
                @click="handleSearch"
                class="w-full sm:w-auto shrink-0 cursor-pointer"
            >
                Search
            </Button>

        </div>

    </div>

  </div>
</template>

<style scoped>
/*  Custom Checkbox Tick (ทริคพิเศษ):
   - เราใช้ Inline Style เผื่อกรณีที่คุณเบสท์ไม่ได้ตั้งคลาส Custom Background ใน Tailwind Config ครับ
   - SVG ด้านล่างนี้คือเครื่องหมายติ๊กถูกสีขาว ที่จะโชว์เมื่อ Checkbox ถูก checked ครับ
*/
input[type="checkbox"]:checked {
  background-image: var(--tw-bg-check-white);
}
</style>