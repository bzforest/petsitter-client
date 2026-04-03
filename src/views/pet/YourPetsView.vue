<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/axios'

import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Petcard from '@/components/ui/Petcard.vue'
import Button from '@/components/ui/Button.vue'
import PetFormModal from '@/components/pet/PetFormModal.vue'
import { Plus, ChevronLeft, Pencil, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const pets = ref<any[]>([])
const isLoading = ref(true)
const showModal = ref(false)
const selectedPet = ref<any>(null)

const fetchPets = async () => {
  try {
    isLoading.value = true
    const { data } = await apiClient.get(`/api/pets/user/${authStore.userId}`)
    pets.value = data
  } catch (err) {
    console.error('Failed to fetch pets', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPets)

const openAddModal = () => {
  selectedPet.value = null
  showModal.value = true
}

const openEditModal = (pet: any) => {
  selectedPet.value = pet
  showModal.value = true
}

const deletePet = async (id: number) => {
  if (!confirm('Are you sure you want to delete this pet?')) return
  
  try {
    await apiClient.delete(`/api/pets/${id}`)
    fetchPets()
  } catch (err) {
    console.error('Failed to delete pet', err)
    alert('Failed to delete pet.')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-brand-gray-50">
    <Navbar />

    <main class="flex-1 container mx-auto px-4 py-12 max-w-6xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <button @click="router.back()" class="flex items-center gap-2 text-brand-gray-400 hover:text-brand-gray-600 transition mb-4 outline-none">
            <ChevronLeft class="w-5 h-5" />
            Back
          </button>
          <h1 class="headline-1 text-brand-gray-900">Your Pet</h1>
          <p class="body-1 text-brand-gray-500">Manage your beloved pets for better services.</p>
        </div>

        <Button variant="primary" class="rounded-full px-8 py-3 flex items-center gap-2 shadow-lg shadow-brand-orange-500/20" @click="openAddModal">
          <Plus class="w-5 h-5" />
          Add New Pet
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-brand-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pets.length === 0" class="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-brand-gray-100">
        <div class="w-32 h-32 bg-brand-orange-50 rounded-full flex items-center justify-center mb-6">
          <Plus class="w-12 h-12 text-brand-orange-500" />
        </div>
        <h3 class="headline-3 text-brand-gray-900 mb-2">No pets found</h3>
        <p class="body-2 text-brand-gray-500 mb-8 max-w-sm">You haven't added any pets yet. Add your first pet to start booking services!</p>
        <Button variant="primary" class="rounded-full px-10" @click="openAddModal">Add Your First Pet</Button>
      </div>

      <!-- Pet List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="pet in pets" :key="pet.id" class="group relative">
          <Petcard 
            :name="pet.name" 
            :type="pet.type" 
            :image="pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'"
            badgeColor="blue"
          />
          
          <!-- Actions Overlay -->
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(pet)" class="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-brand-gray-600 hover:text-brand-orange-500 transition-colors">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="deletePet(pet.id)" class="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-brand-gray-600 hover:text-red-500 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Modals -->
    <PetFormModal 
      v-if="showModal" 
      :pet="selectedPet" 
      @close="showModal = false" 
      @saved="fetchPets"
    />
  </div>
</template>
