<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Upload } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/axios'
import Button from '../ui/Button.vue'
import InputField from '../ui/InputField.vue'
import SelectField from '../ui/SelectField.vue'
import TextareaField from '../ui/TextareaField.vue'

const props = defineProps<{
  pet?: any // If provided, we are in EDIT mode
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const authStore = useAuthStore()
const isSubmitting = ref(false)

const form = ref({
  name: '',
  type: 'Dog',
  breed: '',
  sex: 'Male',
  age: 0,
  weight: 0,
  aboutPet: '',
  imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300' // Placeholder
})

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      selectedFile.value = target.files[0]
      // อัปเดตภาพพรีวิวให้เป็นรูปที่เพิ่งเลือก
      form.value.imageUrl = URL.createObjectURL(target.files[0]) 
    }
}

const typeOptions = [
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
  { label: 'Rabbit', value: 'Rabbit' },
  { label: 'Bird', value: 'Bird' }
]

const sexOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' }
]

onMounted(() => {
  if (props.pet) {
    form.value = { 
      name: props.pet.name || '',
      type: props.pet.type || 'Dog',
      breed: props.pet.breed || '',
      sex: props.pet.sex || 'Male',
      age: props.pet.age || 0,
      weight: props.pet.weight || 0,
      aboutPet: props.pet.aboutPet || '',
      imageUrl: props.pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
    }
  }
})

const handleSave = async () => {
  try {
    isSubmitting.value = true
    
    // เปลี่ยนจากการสร้าง Object ธรรมดาเป็น FormData
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('type', form.value.type)
    fd.append('breed', form.value.breed)
    fd.append('sex', form.value.sex)
    fd.append('age', String(form.value.age))
    fd.append('weight', String(form.value.weight))
    fd.append('aboutPet', form.value.aboutPet)
    fd.append('userId', String(authStore.userId))

    // ถ้ามีการเลือกไฟล์ใหม่ ให้แนบไฟล์ไปด้วย
    if (selectedFile.value) {
      fd.append('image', selectedFile.value)
    } else {
      // ถ้าไม่มีการเลือกไฟล์ใหม่ (เช่นตอนกด Edit แล้วไม่ได้เปลี่ยนรูป) ให้ส่ง URL เดิมไป
      fd.append('imageUrl', form.value.imageUrl)
    }

    // อย่าลืมใส่ Header!
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    if (props.pet?.id) {
      await apiClient.put(`/api/pets/${props.pet.id}`, fd, config)
    } else {
      await apiClient.post('/api/pets', fd, config)
    }

    emit('saved')
    emit('close')
  } catch (err) {
    console.error('Failed to save pet', err)
    alert('Failed to save pet information.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-brand-gray-100">
        <h3 class="headline-3 text-brand-gray-900">{{ pet ? 'Edit Pet' : 'Add New Pet' }}</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-brand-gray-50 rounded-full transition">
          <X class="w-6 h-6 text-brand-gray-400 cursor-pointer" />
        </button>
      </div>

      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-8 space-y-8">
        <!-- Image Upload Placeholder -->
        <div class="flex flex-col items-center gap-4">
          <div @click="fileInput?.click()" class="w-32 h-32 rounded-full bg-brand-gray-50 border-2 border-dashed border-brand-gray-200 flex items-center justify-center relative overflow-hidden group">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover" />
            <div v-else class="text-brand-gray-300 flex flex-col items-center">
              <Upload class="w-8 h-8" />
              <span class="text-xs mt-1">Upload</span>
            </div>
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload class="w-6 h-6 text-white" />
            </div>

            <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
          </div>
          <p class="body-3 text-brand-gray-400">Upload your pet's photo</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Pet Name" placeholder="e.g. Fluffy" v-model="form.name" />
          <SelectField label="Pet Type" :options="typeOptions" v-model="form.type" />
          <InputField label="Breed" placeholder="e.g. Golden Retriever" v-model="form.breed" />
          <SelectField label="Sex" :options="sexOptions" v-model="form.sex" />
          <InputField label="Age (Years)" type="number" :model-value="String(form.age)" @update:model-value="(val: string) => form.age = parseInt(val) || 0" />
          <InputField label="Weight (kg)" type="number" :model-value="String(form.weight)" @update:model-value="(val: string) => form.weight = parseFloat(val) || 0" />
        </div>

        <TextareaField label="About your pet" placeholder="Tell us more about your pet..." v-model="form.aboutPet" />
      </div>

      <!-- Footer Buttons -->
      <div class="p-6 border-t border-brand-gray-100 bg-brand-gray-50 flex gap-4">
        <Button variant="secondary" class="flex-1 rounded-full cursor-pointer" @click="$emit('close')">Cancel</Button>
        <Button variant="primary" class="flex-1 rounded-full cursor-pointer" @click="handleSave" :disabled="isSubmitting">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Information</span>
        </Button>
      </div>
    </div>
  </div>
</template>
