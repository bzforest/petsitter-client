<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputField from '@/components/ui/InputField.vue';
import Button from '@/components/ui/Button.vue';
import ImageUpload from '@/components/ui/ImageUpload.vue';
import apiClient from '@/api/axios'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const profileData = ref({
    full_name: '',
    email: '',
    phone: '',
    id_number: '',
    date_of_birth: '',
    profile_image: '',
    avatarFile: null as File | null
})

const fecthUserProfile = async () => {
    try {
        const response = await apiClient.get('/api/user-profiles/me')
        const data = response.data

        profileData.value = {
            ...profileData.value,
            full_name: data.full_name || '',
            email: authStore.email || data.email || '',
            phone: data.phone || '',
            id_number: data.id_number || '',
            date_of_birth: data.date_of_birth || '',
            profile_image: data.profile_image || ''
        }

    } catch (error) {
        console.error('ไม่สามารถดึงข้อมูล Owner ได้:', error)
    }
}

onMounted(() => {
    fecthUserProfile()
})

const handleFileUpdate = (file: File | null) => {
    profileData.value.avatarFile = file
    console.log('รับไฟล์ใหม่มาแล้ว:', file)
}

const handleUpdateProfile = async () => {
    try {
       const fd = new FormData()
        fd.append('full_name', profileData.value.full_name)
        fd.append('phone', profileData.value.phone)
        fd.append('id_number', profileData.value.id_number)
        fd.append('date_of_birth', profileData.value.date_of_birth)

        // ถ้ามีการเลือกไฟล์รูปใหม่ ให้แนบไฟล์ไปด้วย
        if (profileData.value.avatarFile) {
            fd.append('image', profileData.value.avatarFile)
        }

        await apiClient.put('/api/user-profiles/me', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('Update success!')

    } catch (error) {
        console.error('อัปเดตข้อมูลไม่สำเร็จ:', error)
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง')
    }
}

</script>

<template>
    <div class="w-full flex flex-col gap-10">
      
      <h2 class="headline-3 text-brand-black font-bold">Profile</h2>
  
      <div>
        <ImageUpload
            variant="circle"
            :initialImage="profileData.profile_image"
            @update:file="handleFileUpdate"
        />
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 w-full max-w-[800px]">
        
        <div class="md:col-span-2">
          <InputField 
            label="Your Name*" 
            v-model="profileData.full_name"
            placeholder="Enter your name" 
          />
        </div>
  
        <div class="flex flex-col opacity-70">
          <InputField 
            label="Email*" 
            v-model="profileData.email" 
            disabled
            class="bg-brand-gray-50 cursor-not-allowed" 
          />
        </div>
  
        <div>
          <InputField 
            label="Phone*" 
            v-model="profileData.phone" 
            placeholder="Enter your phone number" 
          />
        </div>
  
        <div>
          <InputField 
            label="ID Number" 
            v-model="profileData.id_number" 
            placeholder="Your ID Number" 
          />
        </div>
  
        <div>
          <InputField 
            label="Date of Birth" 
            type="date"
            v-model="profileData.date_of_birth"
            placeholder="Select Your Date Of Birth" 
          />
        </div>
  
      </div>
  
      <div class="flex justify-end w-full max-w-[800px] mt-2">
        <Button variant="primary" @click="handleUpdateProfile" class="cursor-pointer">
          Update Profile
        </Button>
      </div>
  
    </div>
  </template>