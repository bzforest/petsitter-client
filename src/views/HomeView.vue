<script setup lang="ts">
import SearchBar from '@/components/home/SearchBar.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import Herosection from '@/components/home/HeroSection.vue';
import InfoSection from '@/components/home/InfoSection.vue';
import ElementSection from '@/components/home/ElementSection.vue';
import SearchSidebar from '@/components/search/SearchSidebar.vue';
</script>

<template>
    <main class="min-h-screen bg-white">
      
      <nav class="h-20 w-full border-b border-brand-gray-100 flex items-center justify-center text-brand-gray-300">
        <Navbar />
      </nav>
  
      <section class="relative w-full md:pb-32">
        <Herosection />
      </section>

      <section class="relative w-full md:hidden pt-8">
        <ElementSection />
      </section>
  
      <section class="relative z-10 max-w-[1200px] mx-auto px-4 -mt-30 md:-mt-20">
        <SearchBar />
      </section>
  
      <section class="relative w-full flex justify-center pt-28 md:pb-8">
        <InfoSection />
      </section>
  
      <footer class="py-12 bg-brand-black text-white text-center">
        <Footer />
      </footer>

      <section class="w-full max-w-[1400px] mx-auto px-4 py-20 border-t-4 border-dashed border-brand-gray-200 mt-20">
      
      <div class="mb-8">
        <h2 class="headline-3 text-brand-black">พื้นที่ทดสอบ Search Page</h2>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-start relative">
        
        <aside class="w-full md:w-[430px] shrink-0 sticky top-8 z-20">
          <SearchSidebar />
        </aside>

        <div class="grow w-full bg-brand-gray-50 rounded-[24px] border border-brand-gray-100 min-h-[1500px] flex flex-col items-center justify-start p-10">
          <h2 class="headline-4 text-brand-gray-400 mb-4">พื้นที่วาง PetSitterCard ของเรา</h2>
          <p class="body-2 text-brand-gray-400 text-center">
            (ลอง Scroll เมาส์เลื่อนหน้าเว็บลงมาดูครับ จะเห็นว่า Sidebar ฝั่งซ้ายจะถูกล็อคติดจอไว้ 🪄)
          </p>
        </div>

      </div>
    </section>
  
    </main>
  </template>