<script setup lang="ts">
import { ref, onMounted, watch, h, render as vueRender } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import PetSitterCardSmall from '@/components/ui/PetSitterCardSmall.vue';
import PinSelection from '@/components/ui/PinSelection.vue';
import houseImg from '@/assets/happy_house.png';

// Import Icons from lucide-vue-next
import { List, Map as MapIcon, Plus, Minus, Navigation } from 'lucide-vue-next';

const router = useRouter();

// Mock Data for Sitters based on components
const sitters = ref([
  {
    id: 1,
    title: "Happy House!",
    owner: "Jame Maison",
    location: "Senanikom, Bangkok",
    rating: 5,
    tags: [
      { label: "Dog", color: "green" as const },
      { label: "Cat", color: "pink" as const },
      { label: "Rabbit", color: "yellow" as const },
    ],
    image: houseImg,
    lat: 13.820,
    lng: 100.580,
  },
  {
    id: 2,
    title: "Puppy Paradise 🐶",
    owner: "Sarah Smith",
    location: "Lat Phrao, Bangkok",
    rating: 4,
    tags: [
      { label: "Dog", color: "green" as const }
    ],
    image: houseImg, 
    lat: 13.810,
    lng: 100.600,
  },
  {
    id: 3,
    title: "Kitty Kingdom",
    owner: "Mike Meow",
    location: "Chatuchak, Bangkok",
    rating: 5,
    tags: [
      { label: "Cat", color: "pink" as const },
      { label: "Bird", color: "blue" as const }
    ],
    image: houseImg,
    lat: 13.825,
    lng: 100.560,
  },
  {
    id: 4,
    title: "Bunny Burrow",
    owner: "Alice Wonderland",
    location: "Phaya Thai, Bangkok",
    rating: 4,
    tags: [
      { label: "Rabbit", color: "yellow" as const }
    ],
    image: houseImg,
    lat: 13.780,
    lng: 100.540,
  },
  {
    id: 5,
    title: "Bunny Burrow",
    owner: "Alice Wonderland",
    location: "Phaya Thai, Bangkok",
    rating: 4,
    tags: [
      { label: "Rabbit", color: "yellow" as const }
    ],
    image: houseImg,
    lat: 13.790,
    lng: 100.550,
  }
]);

const selectedSitterId = ref<number | null>(null);
const mapInstance = ref<any>(null);
const userLocation = ref<[number, number] | null>(null);
const isMapInitialized = ref(false);

// ── Horizontal slider (mouse drag + wheel) ──────────────────────────
const sliderRef = ref<HTMLElement | null>(null);
let isDragging = false;
let dragStartX = 0;
let scrollStartLeft = 0;

const onWheel = (e: WheelEvent) => {
  if (!sliderRef.value) return;
  sliderRef.value.scrollLeft += e.deltaY + e.deltaX;
};

const onMouseDown = (e: MouseEvent) => {
  if (!sliderRef.value) return;
  isDragging = true;
  dragStartX = e.pageX - sliderRef.value.offsetLeft;
  scrollStartLeft = sliderRef.value.scrollLeft;
  sliderRef.value.style.cursor = 'grabbing';
  sliderRef.value.style.userSelect = 'none';
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !sliderRef.value) return;
  e.preventDefault();
  const x = e.pageX - sliderRef.value.offsetLeft;
  const walk = (x - dragStartX) * 1.5;
  sliderRef.value.scrollLeft = scrollStartLeft - walk;
};

const onMouseUp = () => {
  isDragging = false;
  if (sliderRef.value) {
    sliderRef.value.style.cursor = 'grab';
    sliderRef.value.style.userSelect = '';
  }
};
const onMouseLeave = () => { isDragging = false; };

onMounted(() => {
  // Add Leaflet CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);

  // Add Leaflet JS
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = () => {
    initLeaflet();
    getUserLocation(); // Requirement Image 2: Geolocation API
  };
  document.head.appendChild(script);
});

const initLeaflet = () => {
  const L = (window as any).L;
  if (!L) return;

  mapInstance.value = L.map('leaflet-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([13.810, 100.580], 13);

  // Modern Styled Map (Google Maps look-alike using CartoDB Positron)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(mapInstance.value);

  drawMarkers();
  isMapInitialized.value = true;
};

const drawMarkers = () => {
  const L = (window as any).L;
  if (!L || !mapInstance.value) return;

  sitters.value.forEach(sitter => {
    const customIcon = L.divIcon({
      className: 'custom-pin-marker',
      html: `<div id="pin-${sitter.id}"></div>`,
      iconSize: [56, 56],
      iconAnchor: [28, 56],
    });

    const marker = L.marker([sitter.lat, sitter.lng], { icon: customIcon }).addTo(mapInstance.value);
    
    // Render the Vue Component into the marker div
    setTimeout(() => {
      const pinContainer = document.getElementById(`pin-${sitter.id}`);
      if (pinContainer) {
        const vnode = h(PinSelection, {
          value: sitter.id,
          modelValue: selectedSitterId.value ?? '',
          'onUpdate:modelValue': (newVal: number) => {
            selectSitter(newVal);
          }
        });
        vueRender(vnode, pinContainer);
      }
    }, 0);

    marker.on('click', () => {
      selectSitter(sitter.id);
    });
  });
};

// Re-render pins when selection changes
watch(selectedSitterId, (id) => {
  sitters.value.forEach(sitter => {
    const pinContainer = document.getElementById(`pin-${sitter.id}`);
    if (pinContainer) {
      const vnode = h(PinSelection, {
        value: sitter.id,
        modelValue: id ?? '',
        'onUpdate:modelValue': (newVal: number) => {
          selectSitter(newVal);
        }
      });
      vueRender(vnode, pinContainer);
    }
  });
});

const selectSitter = (id: number) => {
  selectedSitterId.value = id;
  const sitter = sitters.value.find(s => s.id === id);
  
  if (sitter && mapInstance.value) {
    mapInstance.value.flyTo([sitter.lat, sitter.lng], 15, { duration: 1.5 });
    
    // Scroll to the card in the list
    const cardEl = document.getElementById(`sitter-card-${id}`);
    if (cardEl) {
      // Use smooth centering for the card list
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
};

const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      userLocation.value = [lat, lng];
      
      if (mapInstance.value) {
        mapInstance.value.setView([lat, lng], 13);
        const L = (window as any).L;
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg ring-4 ring-blue-500/30"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })
        }).addTo(mapInstance.value);
      }
    }, (error) => {
      console.warn("Geolocation denied or error:", error);
    });
  }
};

const zoomIn = () => { if (mapInstance.value) mapInstance.value.zoomIn(); };
const zoomOut = () => { if (mapInstance.value) mapInstance.value.zoomOut(); };

const goToSitterProfile = () => {
  router.push('/profile');
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
    <Navbar class="shrink-0" />

    <div class="flex flex-col px-8 py-4 gap-4 mb-10">
      
      <!-- Top header bar: Title and Toggle buttons in ONE line (Requirement 1) -->
      <div class="flex justify-between items-center w-full px-2">
         <h1 class="headline-3 text-brand-gray-900">Search For Pet Sitter</h1>
         
         <div class="flex gap-4">
            <button class="px-5 py-2 rounded-xl border border-brand-gray-200 flex items-center gap-2 text-brand-gray-500 font-bold hover:bg-brand-gray-50 transition drop-shadow-sm bg-white">
              <List :size="20" strokeWidth="2.5" /> List
            </button>
            <button class="px-5 py-2 rounded-xl border border-brand-orange-500 flex items-center gap-2 text-brand-orange-500 bg-[#FFF2E5] shadow-sm font-bold transition">
              <MapIcon :size="20" strokeWidth="2.5" /> Map
            </button>
         </div>
      </div>

      <div class="flex-1 flex gap-8 overflow-hidden">
        <!-- Sidebar placeholder (skipped) -->
        <div class="w-[320px] hidden xl:flex flex-col gap-6 shrink-0 h-full overflow-y-auto">
           <div class="p-8 border-2 border-dashed border-brand-gray-200 rounded-3xl flex flex-col items-center justify-center text-brand-gray-300 text-center flex-1 h-full bg-brand-gray-50/50">
              <p class="font-bold mb-2">Filter Section</p>
              <p class="body-3">(เว้นไว้ก่อน รูปที่ 3)</p>
           </div>
        </div>

        <!-- Main Map Area: map full (Requirement 2) -->
        <div class="flex-1 relative h-[700px] rounded-[16px] overflow-hidden shadow-sm border border-brand-gray-100 bg-[#FAFAFA]">
          
          <div id="leaflet-map" class="w-full h-full z-0 outline-none"></div>

          <!-- Loading Overlay -->
          <div v-if="!isMapInitialized" class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80">
            <div class="w-10 h-10 border-4 border-brand-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-brand-gray-600 font-bold">Loading Interactive Map...</p>
          </div>

          <!-- Zoom Controls -->
          <div class="absolute top-6 right-6 z-400 flex flex-col bg-white rounded-xl shadow-md border border-brand-gray-100 overflow-hidden divide-y divide-brand-gray-100">
            <button @click="zoomIn" class="w-10 h-10 flex items-center justify-center text-brand-gray-500 hover:text-brand-gray-900 hover:bg-brand-gray-50 transition active:bg-brand-gray-100">
              <Plus :size="20" />
            </button>
            <button @click="zoomOut" class="w-10 h-10 flex items-center justify-center text-brand-gray-500 hover:text-brand-gray-900 hover:bg-brand-gray-50 transition active:bg-brand-gray-100">
              <Minus :size="20" />
            </button>
          </div>

          <!-- User Location Center Button -->
          <button @click="getUserLocation" class="absolute top-32 right-6 z-400 w-10 h-10 bg-white rounded-xl shadow-md border border-brand-gray-100 flex items-center justify-center text-brand-gray-500 hover:text-blue-500 transition active:bg-brand-gray-50">
            <Navigation :size="20" />
          </button>

          <!-- Horizontal Card Slider -->
          <!-- w-full is critical to make overflow-x-auto work on absolute positioned element -->
          <div class="absolute bottom-8 left-0 right-0 z-400 w-full">
            <div 
              ref="sliderRef"
              class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-6"
              style="cursor: grab; -webkit-overflow-scrolling: touch;"
              @wheel.prevent="onWheel"
              @mousedown="onMouseDown"
              @mousemove="onMouseMove"
              @mouseup="onMouseUp"
              @mouseleave="onMouseLeave"
            >
              <!-- Spacer to allow first card to be centered -->
              <div class="shrink-0 w-4"></div>
              <div 
                v-for="sitter in sitters" 
                :key="sitter.id" 
                :id="`sitter-card-${sitter.id}`" 
                class="snap-center shrink-0 shadow-lg transition-transform duration-300"
                :class="selectedSitterId === sitter.id ? 'scale-105' : 'scale-100 opacity-95'"
              >
                <!-- Orange Frame on select (Requirement 4) is handled via PetSitterCardSmall's 'selected' prop -->
                <PetSitterCardSmall 
                  :version="'Desktop'"
                  :image="sitter.image"
                  :title="sitter.title"
                  :owner="sitter.owner"
                  :rating="sitter.rating"
                  :tags="sitter.tags"
                  :selected="selectedSitterId === sitter.id"
                  @click="goToSitterProfile"
                />
              </div>
              <!-- Spacer to allow last card to be centered -->
              <div class="shrink-0 w-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer added at the bottom -->
    <Footer />
  </div>
</template>

<style scoped>
/* Standard Scroll - Requirement 3: cannot drag with mouse (native behavior) */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Marker customization */
:deep(.custom-pin-marker) {
  background: transparent;
  border: none;
}

/* User dot animation */
:deep(.user-location-marker div) {
  animation: pulse-blue 2s infinite;
}

@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
</style>
