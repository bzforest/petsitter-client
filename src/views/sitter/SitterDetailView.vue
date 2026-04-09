<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from 'vue-router'
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import apiClient from "@/api/axios";
import { MapPin, MessageSquare, Star } from "lucide-vue-next";
import BookingDateTimeModal from "@/components/booking/BookingDateTimeModal.vue";
import ReviewCard from "@/components/ui/ReviewCard.vue";

import PaginationField from "@/components/ui/PaginationField.vue";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinSelectedImg from "@/assets/Pin Selection/Property 1=Selected.png";

const route = useRoute();
const router = useRouter()
const sitterId = route.params.id;

const showModal = ref(false);

// --- Type Definitions ---
interface Review {
  id: number;
  userId: number;
  userName: string;
  userProfileImage: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SitterProfile {
  id: number;
  userId: number;
  tradeName: string;
  fullName: string;
  email: string;
  bio: string;
  servicesDescription: string;
  placeDescription: string;
  profileImage: string | null;
  pricePerHour: number;
  ratingAvg: number;
  experience: number | null;
  petTypes: string | null;
  province: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  gallery: string[];
  // mapped fields (set in onMounted)
  title: string;
  owner: string;
  rating: number;
  reviews: number;
  tags: { label: string; color: string }[];
  location: string;
  services_description: string;
  place_description: string;
}

// Local State for Reviews
const reviewsList = ref<Review[]>([]);
const reviewsLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalReviews = ref(0);
const selectedRating = ref<number | null>(null);
const sitterUserId = ref<number | null>(null);

// This will hold the Sitter Profile data from the API
const sitter = ref<SitterProfile | null>(null);
const isLoading = ref(true);

const fetchReviews = async (page = 1, rating: number | null = null, targetUserId: number | null = null) => {
  // Use targetUserId if provided (initial load), otherwise use stored sitterUserId
  const uid = targetUserId || sitterUserId.value;
  if (!uid) return;

  try {
    reviewsLoading.value = true;
    const params: any = {
      page: page - 1,
      size: 5,
    };
    if (rating !== null) params.rating = rating;

    const res = await apiClient.get(`/api/reviews/sitter/${uid}`, { params });
    reviewsList.value = res.data.content;
    totalPages.value = res.data.totalPages;
    totalReviews.value = res.data.totalElements;
    currentPage.value = page;
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
  } finally {
    reviewsLoading.value = false;
  }
};

const handleFilterReviews = (rating: number | null) => {
  selectedRating.value = rating;
  fetchReviews(1, rating);
};

const handlePageChange = (newPage: number) => {
  fetchReviews(newPage, selectedRating.value);
  
  // Smooth scroll to reviews section
  const el = document.getElementById("reviews-section");
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    
    // 1. Fetch Sitter Profile FIRST to get real User ID
    const profileRes = await apiClient.get(`/api/sitter-profiles/${sitterId}`);
    const data = profileRes.data;
    sitterUserId.value = data.userId;

    // 2. Fetch Initial Reviews using the real User ID
    await fetchReviews(1, null, data.userId);

    // 3. Mapping backend response to frontend view model
    sitter.value = {
      ...data,
      title: data.tradeName || "Pet Sitter Profile",
      owner: data.fullName || data.email || "Pet Sitter",
      rating: data.ratingAvg || 0,
      reviews: totalReviews.value, // Use actual count from reviews API
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

    if (sitter.value?.latitude && sitter.value?.longitude) {
      await nextTick();
      setTimeout(initMap, 0);
    }
  } catch (err) {
    console.error("Failed to fetch sitter info:", err);
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

  const lat = sitter.value.latitude as number;
  const lng = sitter.value.longitude as number;

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
  //  ดึง ID ของ Sitter คนนี้ออกมา 
  const targetUserId = sitter.value.userId || sitter.value.id; 
  
  if (targetUserId) {
    // สั่งเปลี่ยนหน้าต่างไปที่ /chat พร้อมแนบ Query ?newChat=เลขไอดี
    router.push({ path: '/chat', query: { newChat: targetUserId } });
  } else {
    alert("ไม่พบ ID ของ Sitter คนนี้ครับ");
  }
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
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= sitter.rating ? 'text-brand-green-500 fill-brand-green-500' : 'text-brand-gray-300 fill-brand-gray-300'"
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

          <!-- Rating & Reviews -->
          <section id="reviews-section" class="bg-brand-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
            <div class="flex flex-col bg-white md:flex-row gap-10 items-start md:items-center mb-8 p-4 border-b border-brand-gray-50 rounded-tl-full rounded-bl-full rounded-br-2xl">
              <div
                class="bg-black text-white w-32 h-32 rounded-tr-full rounded-tl-full rounded-bl-full flex flex-col items-center justify-center font-bold shrink-0 shadow-xl"
              >
                <span class="text-4xl mb-1">{{ sitter.rating.toFixed(1) }}</span>
                <span class="text-xs text-brand-gray-300 font-normal"
                  >{{ totalReviews }} Reviews</span
                >
              </div>
              <div class="flex-1">
                <h3 class="headline-3 mb-6 text-[#111827]">
                  Rating & Reviews
                </h3>
                <div class="flex flex-wrap gap-3">
                  <button
                    @click="handleFilterReviews(null)"
                    :class="selectedRating === null 
                      ? 'text-brand-orange-500 border-brand-orange-200 bg-brand-orange-50' 
                      : 'text-brand-gray-500 border-brand-gray-200 hover:bg-brand-gray-50'"
                    class="px-5 py-2 rounded-full text-sm font-bold border transition cursor-pointer"
                  >
                    All Reviews
                  </button>
                  <button
                    v-for="star in [5, 4, 3, 2, 1]"
                    :key="star"
                    @click="handleFilterReviews(star)"
                    :class="selectedRating === star 
                      ? 'text-brand-green-500 border-brand-green-200 bg-brand-green-50' 
                      : 'text-brand-gray-500 border-brand-gray-200 hover:bg-brand-gray-50'"
                    class="px-5 py-2 rounded-full text-sm font-bold border flex gap-1.5 items-center transition cursor-pointer"
                  >
                    {{ star }} <Star class="w-3.5 h-3.5 fill-brand-green-500 text-brand-green-500" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="relative min-h-50">
              <!-- Reviews Loading Overlay -->
              <div v-if="reviewsLoading" class="absolute inset-0 bg-white/50 z-10 flex justify-center items-center">
                <div class="w-8 h-8 border-3 border-brand-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div v-if="reviewsList.length > 0" class="flex flex-col">
                 <ReviewCard 
                  v-for="review in reviewsList"
                  :key="review.id"
                  :reviewerName="review.userName"
                  :avatarUrl="review.userProfileImage ?? undefined"
                  :rating="review.rating"
                  :comment="review.comment"
                  :date="new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })"
                 />
              </div>
              <div v-else class="text-center py-16">
                <div class="w-16 h-16 bg-brand-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star class="w-8 h-8 text-brand-gray-300" />
                </div>
                <p class="headline-4 text-brand-gray-400">No reviews found for this rating.</p>
                <p class="body-2 text-brand-gray-300 mt-1">Try selecting a different filter or check back later.</p>
              </div>
            </div>

            <!-- Pagination (Requirement: 5 per page) -->
            <div v-if="totalPages > 1" class="mt-10 flex justify-center border-t border-brand-gray-50 pt-8">
              <PaginationField 
                :totalPages="totalPages"
                :currentPage="currentPage"
                @update:currentPage="handlePageChange"
              />
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
                v-for="i in 5"
                :key="i"
                class="w-4 h-4"
                :class="i <= sitter.rating ? 'text-brand-green-500 fill-brand-green-500' : 'text-brand-gray-300 fill-brand-gray-300'"
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
