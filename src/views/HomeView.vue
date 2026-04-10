<script setup lang="ts">
import SearchBar from '@/components/home/SearchBar.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import Herosection from '@/components/home/HeroSection.vue';
import InfoSection from '@/components/home/InfoSection.vue';
import ElementSection from '@/components/home/ElementSection.vue';
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
  
      <Footer />
  
    </main>
  </template>