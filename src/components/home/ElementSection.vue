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
    <div class="relative w-full flex flex-col items-center justify-center h-[500px] overflow-hidden z-0">
        <div class="md:hidden absolute left-0 top-0 w-[550px] h-full pointer-events-none z-10">
            <img :src="imgArcYellow" class="absolute top-[15%] left-[-5%] w-22 h-22 object-contain scale-100" alt="Yellow Arc" />
            <img :src="imgPaw" class="absolute top-[7%] left-[17%] w-28 h-28 object-contain scale-100" alt="Pink Paw" />
        
            <img :src="imgHeroCatsGroup" class="absolute top-[20%] left-[-7%] w-72 h-72 object-contain scale-50" alt="Hero Cats with Blue Background" />
        
            <img :src="imgDots" class="absolute top-[30%] left-[10%] w-16 h-8 object-contain scale-120" alt="Pill Dots" />
        </div>
  
        <div class="md:hidden absolute right-0 top-0 w-[550px] h-full pointer-events-none z-10">
            <img :src="imgStarOrange" class="absolute top-[3%] right-[10%] w-32 h-32 object-contain scale-70" alt="Orange Star" />
        
            <img :src="imgHeroDogGroup" class="absolute top-[6%] right-[-16%] w-72 h-72 object-contain scale-60" alt="Hero Dog with Yellow Background" />
        
            <img :src="imgArcGreen" class="absolute top-[45%] right-[6%] w-40 h-40 object-contain scale-70" alt="Arc Green" />
            <img :src="imgCircleWhite" class="absolute top-[45%] right-[20%] w-15 h-15 object-contain scale-70" alt="Circle White" />
        </div>
    </div>
</template>