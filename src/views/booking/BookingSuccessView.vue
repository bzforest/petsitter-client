<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/axios";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import Button from "@/components/ui/Button.vue";
import { MapPin } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const booking = ref<any>(null);
const isLoading = ref(true);

const fetchBookingDetails = async () => {
  try {
    const { data } = await apiClient.get(`/api/bookings/${route.params.id}`);
    booking.value = data;
  } catch (err) {
    console.error("Failed to fetch booking details", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchBookingDetails);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  // Remove seconds if present (e.g., 10:00:00 -> 10:00)
  return timeStr.split(":").slice(0, 2).join(":");
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-brand-gray-50 relative overflow-hidden font-sans"
  >
    <Navbar />

    <!-- 🎨 Background Decorations -->
    <img
      src="@/assets/Element Design/Ellipse 18.png"
      class="absolute top-30 left-5 w-64 opacity-60 pointer-events-none"
    />
    <img
      src="@/assets/Element Design/Vector.png"
      class="absolute top-80 left-40 w-32 opacity-80 rotate-12 pointer-events-none"
    />
    <img
      src="@/assets/Element Design/Star 1.png"
      class="absolute top-70 right-10 w-24 opacity-60 pointer-events-none"
    />
    <img
      src="@/assets/Element Design/Star 2.png"
      class="absolute top-1/3 right-40 w-24 opacity-70 pointer-events-none"
    />

    <div class="absolute bottom-70 left-0 w-1/3 max-w-sm pointer-events-none">
      <img src="@/assets/home/cat3.png" class="w-full object-contain" />
    </div>

    <div class="absolute bottom-70 right-0 w-1/3 max-w-sm pointer-events-none">
      <img src="@/assets/home/dog1.png" class="w-full object-contain" />
    </div>

    <main
      class="flex-1 container mx-auto lg:px-4 pb-20 lg:py-20 flex flex-col items-center justify-center z-10"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div
          class="w-12 h-12 border-4 border-brand-orange-50 border-t-brand-orange-500 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Success Card -->
      <div
        v-else-if="booking"
        class="w-full max-w-2xl bg-white lg:rounded-3xl shadow-2xl shadow-brand-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500"
      >
        <!-- Header -->
        <div class="bg-black p-6 text-center">
          <h1 class="headline-2 text-white mb-2">Thank You For Booking</h1>
          <p class="body-2 text-brand-gray-300">
            We will send your booking information to Pet Sitter.
          </p>
        </div>

        <!-- Content -->
        <div class="p-10 space-y-4">
          <!-- Transaction Info -->
          <div class="space-y-1">
            <p class="body-2 text-brand-gray-300">
              Transaction Date: {{ formatDate(new Date().toISOString()) }}
            </p>
            <p class="body-2 text-brand-gray-300">
              Transaction No.: {{ booking.id }}
            </p>
            <!-- [DEBUG: TEMPORARY] -->
            <!-- <div class="mt-4 p-2 border border-red-500 rounded bg-red-50">
              <p class="text-sm font-bold text-red-600">
                DEBUG INFO (Temporary):
              </p>
              <p class="text-sm text-black">
                Payment Method:
                <span class="font-bold underline">{{
                  booking.paymentMethod
                }}</span>
              </p>
              <p class="text-sm text-black">
                Booking Status:
                <span class="font-bold underline">{{ booking.status }}</span>
              </p>
            </div> -->
          </div>

          <!-- Sitter Info -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="body-3 text-brand-gray-500 font-bold">Pet Sitter:</p>
              <h3 class="headline-3 text-brand-gray-700">
                {{ booking.sitterName }}
              </h3>
            </div>
            <button
              class="flex items-center gap-2 text-brand-orange-500 font-bold hover:underline cursor-pointer"
            >
              <MapPin class="w-5 h-5" />
              View Map
            </button>
          </div>

          <!-- Date & Time Grid -->
          <div class="grid grid-cols-2 gap-8 py-4">
            <div class="space-y-1">
              <p class="body-3 text-brand-gray-500 font-bold">Date & Time:</p>
              <p class="body-2 text-brand-gray-700 font-bold">
                {{ formatDate(booking.startDate) }} |
                {{ formatTime(booking.startTime) }} -
                {{ formatTime(booking.endTime) }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="body-3 text-brand-gray-500 font-bold">Duration:</p>
              <p class="body-2 text-brand-gray-700 font-bold">
                {{ booking.totalHours }} hours
              </p>
            </div>
          </div>

          <!-- Pet Info -->
          <div class="space-y-1 pb-5">
            <p class="body-3 text-brand-gray-500 font-bold">Pet:</p>
            <p class="body-2 text-brand-gray-700 font-bold">
              {{ booking.petNames.join(", ") }}
            </p>
          </div>

          <!-- Total -->
          <div
            class="pt-6 border-t border-brand-gray-100 flex items-center justify-between"
          >
            <p class="body-2 text-black font-bold">Total</p>
            <p class="body-1 text-black font-bold">
              {{ booking.totalPrice }} THB
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex flex-col md:flex-row gap-6">
        <Button
          variant="secondary"
          class="rounded-full px-10 py-4 cursor-pointer"
          @click="router.push('/history/owner')"
        >
          Booking Detail
        </Button>
        <Button
          variant="primary"
          class="rounded-full px-12 py-4 cursor-pointer"
          @click="router.push('/')"
        >
          Back To Home
        </Button>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Decorations */
img[src*="Ellipse"] {
  z-index: 0;
}
</style>
