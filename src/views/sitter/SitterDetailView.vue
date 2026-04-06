<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import apiClient from "@/api/axios";
import { MapPin, MessageSquare, Star } from "lucide-vue-next";
import BookingDateTimeModal from "@/components/booking/BookingDateTimeModal.vue";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinSelectedImg from "@/assets/Pin Selection/Property 1=Selected.png";

const route = useRoute();
const sitterId = route.params.id;

const showModal = ref(false);

// This will hold the Sitter Profile data from the API
const sitter = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    isLoading.value = true;
    const { data } = await apiClient.get(`/api/sitter-profiles/${sitterId}`);

    // Mapping backend response to frontend view model (Matching actual API DTO)
    sitter.value = {
      ...data,
      title: data.tradeName || "Pet Sitter Profile",
      owner: data.fullName || data.email || "Pet Sitter",
      rating: data.ratingAvg || 0,
      reviews: data.reviews || 0, // Fallback if not in DTO yet
      experience: data.experience
        ? `${data.experience} Years Exp.`
        : "New Sitter",
      bio: data.bio || "",
      services_description: data.servicesDescription || "",
      place_description: data.placeDescription || "",
      pricePerHour: data.pricePerHour || 200,
      tags:
        data.tags ||
        (data.petTypes
          ? data.petTypes.split(",").map((t: string) => ({
              label: t.trim(),
              color:
                t.trim() === "Dog"
                  ? "text-green-600 border-green-600 bg-green-50"
                  : "text-pink-500 border-pink-500 bg-pink-50",
            }))
          : []),
      location: data.province
        ? `${data.district || ""}, ${data.province}`
        : "Bangkok",
    };

    if (sitter.value.latitude && sitter.value.longitude) {
      await nextTick();
      setTimeout(initMap, 0);
    }
  } catch (err) {
    console.error("Failed to fetch sitter profile:", err);
  } finally {
    isLoading.value = false;
  }
});

let map: any;

function createPinIcon() {
  return L.divIcon({
    className: "sitter-map-pin-marker",
    html: `<img src="${pinSelectedImg}" class="sitter-map-pin-img" alt="Pin marker" />`,
    iconSize: [56, 56],
    iconAnchor: [28, 56],
  });
}

const initMap = () => {
  const el = document.getElementById("map");
  if (!el || !sitter.value?.latitude) return;

  if (map) {
    map.remove();
    map = null;
  }

  const lat = sitter.value.latitude;
  const lng = sitter.value.longitude;

  map = L.map(el).setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng], { icon: createPinIcon() }).addTo(map);
};

const handleBookNow = () => {
  showModal.value = true;
};

const handleMessage = () => {
  alert("Message functionality is coming soon");
};

// --- Gallery Fallback Logic ---
const defaultImages = [
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
];

const displayGallery = computed(() => {
  const gallery = sitter.value?.gallery || [];
  return [
    gallery[0] || defaultImages[0],
    gallery[1] || defaultImages[1],
    gallery[2] || defaultImages[2],
  ];
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
    <Navbar />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <div
        class="w-10 h-10 border-4 border-brand-orange-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Main Content -->
    <main v-else-if="sitter" class="flex-1 pb-20">
      <!-- Top Gallery Header (3 slots with fallback) -->
      <div class="w-full flex h-[350px] overflow-hidden mb-12">
        <div
          v-for="(img, idx) in displayGallery"
          :key="idx"
          class="w-1/3"
          :class="{ 'border-r-4 border-[#FAFAFA]': idx < 2 }"
        >
          <img
            :src="img"
            class="w-full h-full object-cover"
            :alt="'Gallery image ' + (idx + 1)"
          />
        </div>
      </div>

      <div
        class="container mx-auto px-4 flex flex-col lg:flex-row gap-10 max-w-7xl"
      >
        <!-- Left Column: Details -->
        <div class="lg:w-2/3 flex flex-col gap-10">
          <!-- Title -->
          <div>
            <h1 class="headline-1 mb-2">{{ sitter.title }}</h1>
          </div>

          <!-- Introduction -->
          <section>
            <h2 class="headline-3 mb-3">Introduction</h2>
            <p class="body-2 text-brand-gray-500 leading-relaxed">
              {{ sitter.bio }}
            </p>
          </section>

          <!-- Services -->
          <section>
            <h2 class="headline-3 mb-3">Services</h2>
            <p
              class="body-2 text-brand-gray-500 leading-relaxed whitespace-pre-line"
            >
              {{ sitter.services_description }}
            </p>
          </section>

          <!-- My Place (Map Placeholder) -->
          <section>
            <h2 class="headline-3 mb-3">My Place</h2>
            <p class="body-2 text-brand-gray-500 leading-relaxed mb-4">
              {{ sitter.place_description }}
            </p>

            <!-- Map will be rendered here -->
            <div
              class="w-full h-62.5 bg-gray-200 rounded-2xl overflow-hidden relative shadow-sm"
              id="map"
            ></div>
          </section>

          <!-- Right Column: Sticky Booking Card Mobile-->
          <div class="lg:w-1/3 relative md:hidden">
            <div
              class="sticky top-20 bg-white rounded-2xl shadow-lg border border-gray-100 gap-2 p-8 flex flex-col items-center text-center"
            >
              <!-- Avatar -->
              <div class="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img
                  :src="
                    sitter.profileImage ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                  "
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
              </div>

              <h2 class="headline-2">
                {{ sitter.title }}
              </h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="headline-4">{{ sitter.owner }}</span>
                <span class="body-2 text-brand-green-500">{{
                  sitter.experience
                }}</span>
              </div>

              <div class="flex items-center gap-1 mt-3">
                <Star
                  v-for="i in Math.floor(sitter.rating)"
                  :key="i"
                  class="w-4 h-4 text-brand-green-500 fill-brand-green-500"
                />
              </div>

              <div class="flex items-center gap-1.5 text-brand-gray-500 body-2">
                <MapPin class="w-6 h-6" /> {{ sitter.location }}
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap justify-center gap-2 mt-4">
                <Badge
                  v-for="tag in sitter.tags"
                  :key="tag.label"
                  :label="tag.label"
                  :class="tag.color"
                  variant="pill"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex w-full gap-3 mt-8">
                <Button
                  @click="handleMessage"
                  variant="secondary"
                  class="rounded-full w-1/2 cursor-pointer"
                >
                  <template #left-icon>
                    <MessageSquare :size="20" />
                  </template>
                  Message
                </Button>

                <Button
                  @click="handleBookNow"
                  variant="primary"
                  class="rounded-full w-1/2 cursor-pointer"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>

          <!-- Rating & Reviews (Static Placeholder for now) -->
          <section
            class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-10 items-center"
          >
            <div
              class="bg-black text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold"
            >
              <span class="text-3xl">{{ sitter.rating }}</span>
              <span class="text-xs text-brand-gray-300 font-normal"
                >{{ sitter.reviews }} reviews</span
              >
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-xl mb-4 text-[#111827]">
                Rating & Reviews
              </h3>
              <div class="flex gap-4">
                <button
                  class="text-orange-500 border border-orange-200 bg-orange-50 px-4 py-1.5 rounded-full text-sm font-bold"
                >
                  All Reviews
                </button>
                <button
                  class="text-gray-500 border border-gray-200 px-4 py-1.5 rounded-full text-sm flex gap-1 items-center"
                >
                  5 <Star class="w-3 h-3 fill-green-500 text-green-500" />
                </button>
                <button
                  class="text-gray-500 border border-gray-200 px-4 py-1.5 rounded-full text-sm flex gap-1 items-center"
                >
                  4 <Star class="w-3 h-3 fill-green-500 text-green-500" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Sticky Booking Card -->
        <div class="lg:w-1/3 relative md:block hidden">
          <div
            class="sticky top-20 bg-white rounded-2xl shadow-lg border border-gray-100 gap-2 p-8 flex flex-col items-center text-center"
          >
            <!-- Avatar -->
            <div class="w-40 h-40 rounded-full overflow-hidden mb-4">
              <img
                :src="
                  sitter.profileImage ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                "
                alt="Avatar"
                class="w-full h-full object-cover"
              />
            </div>

            <h2 class="headline-2">
              {{ sitter.title }}
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="headline-4">{{ sitter.owner }}</span>
              <span class="body-2 text-brand-green-500">{{
                sitter.experience
              }}</span>
            </div>

            <div class="flex items-center gap-1 mt-3">
              <Star
                v-for="i in Math.floor(sitter.rating)"
                :key="i"
                class="w-4 h-4 text-brand-green-500 fill-brand-green-500"
              />
            </div>

            <div class="flex items-center gap-1.5 text-brand-gray-500 body-2">
              <MapPin class="w-6 h-6" /> {{ sitter.location }}
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap justify-center gap-2 mt-4">
              <Badge
                v-for="tag in sitter.tags"
                :key="tag.label"
                :label="tag.label"
                :class="tag.color"
                variant="pill"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex w-full gap-3 mt-8">
              <Button
                @click="handleMessage"
                variant="secondary"
                class="rounded-full w-1/2 cursor-pointer"
              >
                <template #left-icon>
                  <MessageSquare :size="20" />
                </template>
                Message
              </Button>

              <Button
                @click="handleBookNow"
                variant="primary"
                class="rounded-full w-1/2 cursor-pointer"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Pop-up Booking Modal -->
    <BookingDateTimeModal
      v-if="showModal"
      :sitterId="Number(sitterId)"
      @close="showModal = false"
    />
  </div>
</template>

<style>
.sitter-map-pin-marker {
  background: transparent !important;
  border: none !important;
}
.sitter-map-pin-img {
  width: 56px;
  height: 56px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}
</style>
