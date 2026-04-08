<script setup lang="ts">
import { ref, onMounted, watch, h, render as vueRender, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import PetSitterCardSmall from '@/components/ui/PetSitterCardSmall.vue';
import PetSitterCardLarge from '@/components/ui/PetSitterCardLarge.vue';
import PinSelection from '@/components/ui/PinSelection.vue';
import SearchSidebar from '@/components/search/SearchSidebar.vue';
import PaginationField from '@/components/ui/PaginationField.vue';
import houseImg from '@/assets/happy_house.png';

// Import Icons from lucide-vue-next
import { List, Map as MapIcon, Plus, Minus, Navigation, Search as SearchIcon, ChevronUp } from 'lucide-vue-next';
import RatingSelection from '@/components/ui/RatingSelection.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Button from '@/components/ui/Button.vue'
import { onUnmounted } from 'vue';
import apiClient from '@/api/axios'; // Add this

const router = useRouter();
const route = useRoute();

// View switching state
const viewMode = ref<'list' | 'map'>('list');

// Mock Data for Sitters (Thai context as requested)
const sitters = ref<any[]>([]);

const tagColorMap: Record<string, string> = {
  'Dog': 'green',
  'Cat': 'pink',
  'Rabbit': 'yellow',
  'Bird': 'blue'
};

const fetchSitters = async () => {
  try {
    const response = await apiClient.get('/api/sitter-profiles', {
      params: { 
        size: 100, // Get enough for map pins
        query: route.query.q,
        petTypes: route.query.pets,
        rating: route.query.rating,
        experience: route.query.exp
      }
    });
    
    // Map backend response to frontend view model
    sitters.value = response.data.content.map((profile: any) => ({
      id: profile.id,
      title: profile.tradeName || "รับฝากสัตว์เลี้ยง",
      owner: profile.fullName || "ไม่ระบุชื่อ",
      location: profile.province ? `${profile.district || ''}, ${profile.province}` : "ไม่ระบุตำแหน่ง",
      rating: Math.floor(profile.ratingAvg || 0),
      avatar: profile.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      tags: (profile.petTypes || "").split(',').filter(Boolean).map((tag: string) => ({
        label: tag.trim(),
        color: (tagColorMap[tag.trim()] || 'green') as any
      })),
      image: (profile.gallery && profile.gallery.length > 0) ? profile.gallery[0] : houseImg,
      lat: profile.latitude, // Remove default
      lng: profile.longitude, // Remove default
    }));
    
    // Draw markers after fetching
    if (mapInstance.value) {
      drawMarkers();
    }
  } catch (error) {
    console.error('Failed to fetch sitters:', error);
  }
};

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(sitters.value.length / itemsPerPage));

const paginatedSitters = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sitters.value.slice(start, end);
});

const selectedSitterId = ref<number | null>(null);
const mapInstance = ref<any>(null);
const markerGroup = ref<any>(null);
const userLocation = ref<[number, number] | null>(null);
const isMapInitialized = ref(false);

// Responsive state
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 1280 : false);
const checkMobile = () => {
  isMobile.value = typeof window !== 'undefined' ? window.innerWidth < 1280 : false; // xl threshold
};

// Mobile Filter State
const mobilePetTypes = ref<string[]>([]);
const petOptions = ['Dog', 'Cat', 'Bird', 'Rabbit'];
const mobileRating = ref<number | null>(null);
const mobileExperience = ref<string>('0-2 Years');
const expOptions = [
  { label: '0-2 Years', value: '0-2 Years' },
  { label: '3-5 Years', value: '3-5 Years' },
  { label: '5+ Years', value: '5+ Years' }
];

const handleMobileSearch = () => {
  router.push({
    query: {
      pets: mobilePetTypes.value.length ? mobilePetTypes.value : undefined,
      rating: mobileRating.value || undefined,
      exp: mobileExperience.value
    }
  });
};

const showScrollTop = ref(false);
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

// ── Horizontal slider (mouse drag + wheel) ──────────────────────────
const sliderRef = ref<HTMLElement | null>(null);
let isDragging = false;
let dragStartX = 0;
let scrollStartLeft = 0;

// Watch for query changes to re-fetch
watch(() => route.query, () => {
  currentPage.value = 1; // Reset to page 1 on filter
  fetchSitters();
}, { deep: true });

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
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('scroll', handleScroll);

  // Add Leaflet CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);

  // Add Leaflet JS
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = async () => {
    initLeaflet();
    getUserLocation();
    await fetchSitters(); // Fetch data after Leaflet is ready
  };
  document.head.appendChild(script);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('scroll', handleScroll);
});

const initLeaflet = () => {
  const L = (window as any).L;
  if (!L) return;

  // We only initialize the map once
  if (mapInstance.value) return;

  mapInstance.value = L.map('leaflet-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([13.810, 100.580], 13);

  // Modern Styled Map (Google Maps look-alike using CartoDB Positron)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(mapInstance.value);

  markerGroup.value = L.layerGroup().addTo(mapInstance.value);

  drawMarkers();
  isMapInitialized.value = true;
};

const drawMarkers = () => {
  const L = (window as any).L;
  // Clear existing markers
  markerGroup.value.clearLayers();

  sitters.value.forEach(sitter => {
    // Check if coordinates exist before drawing pin
    if (!sitter.lat || !sitter.lng) return;

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
watch([selectedSitterId, isMapInitialized], ([id, initialized]) => {
  if (!initialized) return;
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

const goToSitterProfile = (id: number) => {
  router.push({ name: 'sitter-detail', params: { id } });
};

// Ensure map renders correctly when switching back from List view
watch(viewMode, (newMode) => {
  if (newMode === 'map') {
    // Call multiple times to ensure the map renders correctly after any transitions
    [50, 200, 500].forEach(delay => {
      setTimeout(() => {
        if (mapInstance.value) {
          mapInstance.value.invalidateSize();
        } else {
          initLeaflet();
        }
      }, delay);
    });
  }
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
    <Navbar class="shrink-0" />

    <div class="flex flex-col xl:px-8 py-4 gap-4 mb-20">
      
      <!-- Mobile Filter (MD/Mobile Layout - Image 1 & 2) -->
      <div v-if="isMobile" class="xl:hidden w-auto mx-8 flex flex-col gap-6 bg-brand-gray-50/50 p-6 rounded-[24px] border border-brand-gray-100 mb-4 h-full">
         <div class="flex flex-col gap-3">
           <label class="body-1 text-brand-gray-900 font-bold">Pet Type:</label>
           <div class="flex flex-wrap gap-4">
              <label v-for="pet in petOptions" :key="pet" class="flex items-center gap-4 cursor-pointer group">
                <input 
                  type="checkbox" :value="pet" v-model="mobilePetTypes"
                  class="w-6 h-6 rounded border-2 border-brand-gray-300 checked:bg-brand-orange-500 checked:border-brand-orange-500 appearance-none bg-white checked:bg-check-white bg-center bg-no-repeat bg-size-16px_16px"
                  style="--tw-bg-check-white: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%2720 6 9 17 4 12%27/%3E%3C/svg%3E')"
                />
                <span class="body-2 text-brand-gray-700">{{ pet }}</span>
              </label>
           </div>
         </div>

         <div class="flex flex-col gap-3">
           <label class="body-1 text-brand-gray-900 font-bold">Rating:</label>
           <div class="flex flex-wrap gap-2">
              <RatingSelection 
                v-for="rate in [5,4,3,2,1]" :key="rate"
                :rating="rate" 
                v-model="mobileRating"
                class="scale-90 origin-left"
              />
           </div>
         </div>

         <div class="flex flex-col gap-3">
           <label class="body-1 text-brand-gray-900 font-bold">Experience:</label>
           <SelectField label="" v-model="mobileExperience" :options="expOptions" placeholder="Select" />
         </div>

         <Button variant="primary" @click="handleMobileSearch" class="w-full py-4 headline-4 mt-2">Search</Button>
      </div>

      <!-- Top header bar: Title and Toggle buttons -->
      <div class="mx-8 xl:mx-0 flex flex-col xl:flex-row justify-between items-center xl:items-start xl:w-full py-4 gap-4 border-b xl:border-none border-brand-gray-100 mb-6">
         <h1 class="headline-2 text-brand-gray-900 font-bold text-center xl:text-left w-full xl:w-auto">Search For Pet Sitter</h1>
         
         <!-- View Switcher -->
         <div class="flex gap-4 p-1 w-full justify-center xl:w-auto xl:mr-2">
            <button 
              @click="viewMode = 'list'"
              class="flex-1 xl:flex-none px-6 xl:px-10 py-3 xl:py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 border-2"
              :class="viewMode === 'list' 
                ? 'border-brand-orange-500 text-brand-orange-500 bg-white shadow-sm' 
                : 'border-brand-gray-300 text-brand-gray-300 hover:border-brand-gray-400 hover:text-brand-gray-400 bg-white'"
            >
              <List :size="18" strokeWidth="2.5" /> List
            </button>
            <button 
              @click="viewMode = 'map'"
              class="flex-1 xl:flex-none px-6 xl:px-10 py-3 xl:py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 border-2"
              :class="viewMode === 'map' 
                ? 'border-brand-orange-500 text-brand-orange-500 bg-white shadow-sm' 
                : 'border-brand-gray-300 text-brand-gray-300 hover:border-brand-gray-400 hover:text-brand-gray-400 bg-white'"
            >
              <MapIcon :size="18" strokeWidth="2.5" /> Map
            </button>
         </div>
      </div>

      <div class="flex-1 flex flex-col xl:flex-row gap-8">
        <!-- Sidebar: Desktop only -->
        <div class="w-[320px] hidden xl:flex flex-col shrink-0">
           <SearchSidebar />
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 min-h-[700px]">
          
          <!-- MAP VIEW (Full width on mobile) -->
          <div v-show="viewMode === 'map'" class="relative h-[800px] md:h-[800px] xl:h-full w-full rounded-none xl:rounded-[24px] overflow-hidden shadow-sm border-y xl:border border-brand-gray-100 bg-white">
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

            <!-- Horizontal Card Slider (Visible only in Map Mode) -->
            <div class="absolute bottom-10 left-0 right-0 z-400 w-full animate-fade-in-up">
              <div 
                ref="sliderRef"
                class="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-8"
                style="cursor: grab; -webkit-overflow-scrolling: touch;"
                @wheel.prevent="onWheel"
                @mousedown="onMouseDown"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
                @mouseleave="onMouseLeave"
              >
                <div class="shrink-0 w-4"></div>
                <div 
                  v-for="sitter in sitters" 
                  :key="sitter.id" 
                  :id="`sitter-card-${sitter.id}`" 
                  class="snap-center shrink-0 transition-all duration-300"
                  :class="selectedSitterId === sitter.id ? 'scale-105 z-10' : 'scale-100'"
                >
                  <PetSitterCardSmall 
                    :version="isMobile ? 'Mobile' : 'Desktop'"
                    :image="sitter.image"
                    :title="sitter.title"
                    :owner="sitter.owner"
                    :rating="sitter.rating"
                    :tags="sitter.tags"
                    :selected="selectedSitterId === sitter.id"
                    @click="goToSitterProfile(sitter.id)"
                  />
                </div>
                <div class="shrink-0 w-8"></div>
              </div>
            </div>
          </div>

          <!-- LIST VIEW (Requirement 2: Use PetSitterCardLarge and Vertical Stack) -->
          <div v-if="viewMode === 'list'" class="animate-fade-in flex flex-col items-center xl:items-start gap-6 px-8 xl:px-0">
              <PetSitterCardLarge 
                v-for="sitter in paginatedSitters"
                :key="sitter.id"
                :version="isMobile ? 'mb' : 'desktop'"
                :image="sitter.image"
                :avatar="sitter.avatar"
                :title="sitter.title"
                :owner="sitter.owner"
                :rating="sitter.rating"
                :location="sitter.location"
                :tags="sitter.tags"
                class="w-full xl:max-w-none"
                @click="goToSitterProfile(sitter.id)"
              />
              
              <!-- Pagination (Requirement 1: Centered) -->
              <div v-if="totalPages > 1" class="w-full flex justify-center mt-12 pb-10">
                <PaginationField 
                  :totalPages="totalPages"
                  v-model:current-page="currentPage"
                />
              </div>
             
             <!-- Empty state -->
             <div v-if="sitters.length === 0" class="w-full flex flex-col items-center justify-center py-40 text-brand-gray-300">
                <div class="w-24 h-24 bg-brand-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SearchIcon class="w-12 h-12" />
                </div>
                <p class="headline-3 text-brand-gray-400">ไม่พบข้อมูลผู้รับฝากสัตว์เลี้ยง</p>
                <p class="body-1 text-brand-gray-400 mt-2">ลองปรับการตั้งค่าตัวกรองของคุณ หรือค้นหาพื้นที่อื่น</p>
             </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />

    <!-- Back to Top Button (Mobile only) -->
    <Transition name="fade">
      <button 
        v-if="isMobile && showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-10 right-8 z-[9999] w-14 h-14 bg-brand-orange-50 rounded-full flex items-center justify-center text-brand-orange-500 border border-brand-orange-100 active:scale-95 transition-all shadow-lg"
      >
        <ChevronUp :size="32" strokeWidth="2.5" />
      </button>
    </Transition>
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

/* Transitions */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vue Transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
