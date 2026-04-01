<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import imgInfoCat from '@/assets/home/info-cat-1.png';
import ImgConnect from '@/assets/home/connect.png';
import ImgBetter from '@/assets/home/better.png';
import ImgCalling from '@/assets/home/calling.png'

import ImgArcYellow from '@/assets/Element Design/Ellipse 16.png'
import ImgArcBlue from '@/assets/Element Design/Ellipse 17.png'
import ImgGreenStar from '@/assets/Element Design/Star 1.png'

const services = [
  { title: 'Boarding', desc: "Your pets stay overnight in your sitter's home. They'll be treated like part of the family in a comfortable environment.", color: 'text-brand-blue-500' },
  { title: 'House Sitting', desc: "Your sitter takes care of your pets and your home. Your pets will get all the attention they need without leaving home.", color: 'text-brand-pink-500' },
  { title: 'Dog Walking', desc: "Your dog gets a walk around your neighborhood. Perfect for busy days and dogs with extra energy to burn.", color: 'text-brand-green-500' },
  { title: 'Drop-In Visits', desc: "Your sitter drops by your home to play with your pets, offer food, and give potty breaks or clean the litter box.", color: 'text-brand-yellow-500' }
];
</script>

<template>
  <div class="w-full max-w-[1200px] flex flex-col gap-24">
    
    <h2 class="headline-3 md:headline-2 text-center text-brand-black px-4">
      "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center px-4">
      
      <div class="flex flex-col gap-8 md:gap-10">
        <div v-for="item in services" :key="item.title" class="flex gap-4">
          <div class="mt-1">
            <span class="text-[20px] leading-none" :class="item.color">✹</span>
          </div>
          <div>
            <h3 class="headline-4 text-brand-black mb-2 font-bold">{{ item.title }}</h3>
            <p class="body-2 text-brand-gray-500 pr-4">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-center md:justify-end">
        <div class="w-[300px] sm:w-[400px] md:w-[455px] aspect-455/601 bg-[#FDECC8] overflow-hidden" 
             style="border-radius: 227.5px 227.5px 227.5px 16px;">
          <div class="w-full h-full flex items-center justify-center">
            <img :src="imgInfoCat" alt="Cat Boarding" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-8 px-4">
      
      <div class="flex flex-col items-center">
        <div class="w-[200px] h-[200px] sm:w-[268px] sm:h-[268px] bg-brand-gray-100 rounded-full mb-6 overflow-hidden">
            <img :src="ImgConnect" alt="Connect With Sitters" class="w-full h-full object-cover" />
        </div>
        <h3 class="headline-4 text-brand-gray-900 mb-2">
          <span class="text-brand-green-500">Connect</span> With Sitters
        </h3>
        <p class="body-2 text-brand-gray-500">Find a verified and reviewed sitter who'll keep your pets company and give time.</p>
      </div>

      <div class="flex flex-col items-center">
        <div class="w-[200px] h-[200px] sm:w-[268px] sm:h-[268px] bg-brand-gray-100 rounded-full mb-6 overflow-hidden">
            <img :src="ImgBetter" alt="Connect With Sitters" class="w-full h-full object-cover" />
        </div>
        <h3 class="headline-4 text-brand-gray-900 mb-2">
          <span class="text-brand-blue-500">Better</span> For Your Pets
        </h3>
        <p class="body-2 text-brand-gray-500">Pets stay happy at home with a sitter who gives them loving care and companionship.</p>
      </div>

      <div class="flex flex-col items-center">
        <div class="w-[200px] h-[200px] sm:w-[268px] sm:h-[268px] bg-brand-gray-100 rounded-full mb-6 overflow-hidden">
            <img :src="ImgCalling" alt="Connect With Sitters" class="w-full h-full object-cover" />
        </div>
        <h3 class="headline-4 text-brand-gray-900 mb-2">
          <span class="text-brand-orange-500">Calling</span> All Pets
        </h3>
        <p class="body-2 text-brand-gray-500">Stay for free with adorable animals in unique homes around the world.</p>
      </div>

    </div>

    <div class="relative w-full bg-brand-yellow-50 overflow-hidden px-4 py-28 md:px-8 md:py-20 flex flex-col items-center justify-center text-center mt-12 md:rounded-3xl">
      
      <div class="relative z-10 w-full max-w-[400px] md:max-w-none mx-auto">
        
        <h1 class="headline-2 md:headline-1 md:text-auto text-brand-black mb-8 font-bold">
          Perfect Pet Sitter<br />For Your Pet
        </h1>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Button variant="secondary" class="w-full sm:w-auto cursor-pointer">Become A Pet Sitter</Button>
          <Button variant="primary" class="w-full sm:w-auto cursor-pointer">Find A Pet Sitter</Button>
        </div>
        
      </div>

        <img :src="ImgArcBlue" alt="Connect With Sitters" class="w-[337px] h-[168px] object-cover absolute md:top-[220px] md:left-[-2px] bottom-[-25px] left-[-70px] scale-80" />
        <img :src="ImgArcYellow" alt="Connect With Sitters" class="w-[337px] h-[332px] object-cover absolute md:top-[-100px] md:right-[-70px] md:scale-75 scale-50 top-[-175px] right-[-120px]" />
        <img :src="ImgGreenStar" alt="Connect With Sitters" class="w-[337px] h-[332px] object-cover absolute md:top-[50px] md:right-[60px] md:scale-45 scale-35 top-[-80px] right-[-15px]" />
    
    </div>

  </div>
</template>