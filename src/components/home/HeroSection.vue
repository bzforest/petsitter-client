<script setup lang="ts">
import imgArcYellow from "@/assets/Element Design/Ellipse 15.png";    
import imgArcGreen from "@/assets/Element Design/Ellipse 18.png";   
import imgDots from "@/assets/Element Design/Frame 427320928.png";        
import imgStarOrange from "@/assets/Element Design/Star 2.png";        
import imgPaw from "@/assets/Element Design/Vector.png";               
import imgCircleWhite from "@/assets/Element Design/Ellipse 19.png";
import imgHeroCatsGroup from '@/assets/home/hero-cats-group.png'; 
import imgHeroDogGroup from '@/assets/home/hero-dog-group.png';
</script>

<template>
    <div class="relative w-full max-w-[1700px] mx-auto px-4 pt-4 md:pt-20 md:pb-32 flex flex-col items-center md:min-h-[550px] overflow-hidden z-0">
      
      <div class="relative z-10 text-center flex flex-col items-center mt-8 md:mt-0 md:pt-10">
        <h1 class="headline-1 md:display font-extrabold text-brand-black leading-[1.1] md:leading-[1.1] mb-4 md:mb-6 whitespace-nowrap">
          Pet Sitter<span class="text-brand-orange-500">,</span><br />
          Perfect<span class="text-brand-blue-500">,</span><br />
          For Your Pet<span class="text-brand-yellow-500">.</span>
        </h1>
        <p class="body-1 md:headline-3 text-brand-gray-700">
          Find your perfect pet sitter with us.
        </p>
      </div>
  
      <div class="hidden md:block absolute left-0 top-0 w-[550px] h-full pointer-events-none z-0">
        <img :src="imgArcYellow" class="absolute top-[27%] left-[12%] w-22 h-22 object-contain scale-150" alt="Yellow Arc" />
        <img :src="imgPaw" class="absolute top-[15%] left-[53%] w-28 h-28 object-contain scale-175" alt="Pink Paw" />
        
        <img :src="imgHeroCatsGroup" class="absolute top-[42%] left-[20%] w-72 h-72 object-contain" alt="Hero Cats with Blue Background" />
        
        <img :src="imgDots" class="absolute top-[42%] left-[28%] w-16 h-8 object-contain scale-150" alt="Pill Dots" />
      </div>
  
      <div class="hidden md:block absolute right-0 top-0 w-[550px] h-full pointer-events-none z-0">
        <img :src="imgStarOrange" class="absolute top-[15%] right-[65%] w-32 h-32 object-contain scale-125" alt="Orange Star" />
        
        <img :src="imgHeroDogGroup" class="absolute top-[20%] right-[20%] w-72 h-72 object-contain" alt="Hero Dog with Yellow Background" />
        
        <img :src="imgArcGreen" class="absolute top-[65%] right-[50%] w-40 h-40 object-contain scale-150" alt="Arc Green" />
        <img :src="imgCircleWhite" class="absolute top-[57%] right-[67%] w-15 h-15 object-contain scale-110" alt="Circle White" />
      </div>
  
    </div>
  </template>