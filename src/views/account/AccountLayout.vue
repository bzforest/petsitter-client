<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue' // อย่าลืมเช็ค Path นะครับ
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()

// เมนูสำหรับ Sidebar
const menuItems = [
  { name: 'Profile', path: '/account/profile', icon: 'User' }, // อนาคตค่อยใส่ Icon
  { name: 'Your Pet', path: '/account/yourpet', icon: 'PawPrint' },
  { name: 'Booking History', path: '/account/bookings', icon: 'List' }
]
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col">
    <Navbar />

    <main class="grow w-full max-w-[1200px] mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 items-start">
      
      <aside class="w-full md:w-[280px] shrink-0 bg-white rounded-2xl p-6 shadow-sm border border-brand-gray-100">
        <h2 class="headline-4 text-brand-black font-bold mb-6">Account</h2>
        
        <nav class="flex flex-col gap-2">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors body-2 font-medium"
            :class="route.path.includes(item.path) 
              ? 'bg-brand-orange-50 text-brand-orange-500' 
              : 'text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-gray-900'"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </aside>

      <section class="grow w-full bg-white rounded-2xl p-8 shadow-sm border border-brand-gray-100 min-h-[500px]">
        <router-view></router-view>
      </section>

    </main>

    <Footer />
  </div>
</template>