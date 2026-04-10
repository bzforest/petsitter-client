<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookingConfirm from "@/components/ui/BookingConfirm.vue";
import SitterRejectConfirmPopup from "@/components/booking/SitterRejectConfirmPopup.vue";
import SitterPetDetailModal from "@/components/booking/SitterPetDetailModal.vue";
import SitterOwnerProfileModal from "@/components/booking/SitterOwnerProfileModal.vue";
import {
  completeBookingBySitter,
  confirmBookingBySitter,
  getBookingById,
  invalidateSitterBookingsListCache,
  rejectBookingBySitter,
  startInServiceBySitter,
  type BookingResponse,
} from "@/services/booking.service";
import { getPetsByUserId, type PetResponse } from "@/services/pet.service";
import { getOwnerProfileByUserId } from "@/services/userProfile.service";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const booking = ref<BookingResponse | null>(null);
const pets = ref<PetResponse[]>([]);
type OwnerProfileLite = {
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string | null;
  idNumber?: string;
  dateOfBirth?: string;
};
const ownerProfile = ref<OwnerProfileLite | null>(null);
const loading = ref(false);
const actionLoading = ref(false);

const showConfirmModal = ref(false);
const showRejectModal = ref(false);
const showPetModal = ref(false);
const selectedPet = ref<PetResponse | null>(null);
const showOwnerModal = ref(false);

const bookingId = computed(() => Number(route.params.id));

function extractErrorMessage(error: unknown, fallback: string): string {
  const maybe = error as { response?: { data?: { message?: string } } };
  return maybe?.response?.data?.message || fallback;
}

const canMarkSuccess = computed(() => {
  // Future fallback (time-gated success):        << เช็คเวลาเสร็จสิ้นการบริการ ก่อนถึงจะสามารถกดปุ่มsuccessได้ ป้องกันsitterแอบกดปุ่มเสร็จงานก่อนกำหนด (เผื่อใช้ในอนาคต)>>
  // function bookingEndMs(b: BookingResponse): number {
  //   const d = String(b.endDate).slice(0, 10);
  //   let t = String(b.endTime);
  //   if (/^\d{1,2}:\d{2}$/.test(t)) t = `${t}:00`;
  //   const ms = new Date(`${d}T${t}`).getTime();
  //   return Number.isNaN(ms) ? Date.now() : ms;
  // }
  // return booking.value?.status === "IN_SERVICE" && Date.now() >= bookingEndMs(booking.value);

  return booking.value?.status === "IN_SERVICE";
});

const statusLabel = computed(() => {
  if (!booking.value) return "-";
  if (booking.value.status === "CONFIRMED") return "Waiting for service";
  if (booking.value.status === "IN_SERVICE") return "In service";
  if (booking.value.status === "COMPLETED") return "Success";
  if (booking.value.status === "CANCELLED") return "Cancelled";
  return "Waiting for confirm";
});

const isWaiting = computed(() => booking.value?.status === "PENDING" || booking.value?.status === "PAID");
const isWaitingForService = computed(
  () => booking.value?.status === "CONFIRMED"
);
const isActivelyInService = computed(
  () => booking.value?.status === "IN_SERVICE"
);

const transactionDateLabel = computed(() => {
  if (booking.value?.createdAt) {
    return new Date(booking.value.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (booking.value?.startDate) {
    return new Date(booking.value.startDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return "-";
});

const ownerDisplayName = computed(() => {
  if (!booking.value) return "-";
  const b = booking.value;
  const prof = ownerProfile.value;
  const fromProfileName = prof?.fullName?.trim();
  if (fromProfileName) return fromProfileName;
  const fromProfileEmail = prof?.email?.trim();
  if (fromProfileEmail && fromProfileEmail !== "-") return fromProfileEmail;
  const fromBooking = b.ownerName?.trim();
  if (fromBooking) return fromBooking;
  return `User #${b.userId}`;
});

function applyOwnerProfileFromApi(data: {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  idNumber: string | null;
  dateOfBirth: string | null;
}) {
  ownerProfile.value = {
    fullName: data.fullName || "",
    email: data.email || "-",
    phone: data.phone || "-",
    profileImage: data.profileImage || null,
    idNumber: data.idNumber || "-",
    dateOfBirth: data.dateOfBirth || "-",
  };
}

function applyOwnerProfileFallback() {
  const b = booking.value;
  ownerProfile.value = {
    fullName: b?.ownerName?.trim() || "",
    email: "-",
    phone: "-",
    profileImage: null,
    idNumber: "-",
    dateOfBirth: "-",
  };
}

async function loadDetail() {
  try {
    loading.value = true;
    ownerProfile.value = null;
    const { data } = await getBookingById(bookingId.value);
    booking.value = data;

    const selectedPetIds = data.petIds;
    const [petRes, ownerRes] = await Promise.all([
      getPetsByUserId(data.userId),
      getOwnerProfileByUserId(data.userId).catch(() => null),
    ]);

    pets.value = petRes.data.filter((p) => selectedPetIds.includes(p.id));

    if (ownerRes) {
      applyOwnerProfileFromApi(ownerRes.data);
    } else {
      applyOwnerProfileFallback();
    }
  } catch {
    showToast("Failed to load booking detail", "error");
  } finally {
    loading.value = false;
  }
}

function openPetDetail(petId: number) {
  selectedPet.value = pets.value.find((p) => p.id === petId) || null;
  showPetModal.value = true;
}

async function confirmBooking() {
  try {
    actionLoading.value = true;
    await confirmBookingBySitter(bookingId.value);
    showToast("Booking confirmed", "success");
    showConfirmModal.value = false;
    await loadDetail();
  } catch (error) {
    showToast(extractErrorMessage(error, "Failed to confirm booking"), "error");
  } finally {
    actionLoading.value = false;
  }
}

async function rejectBooking() {
  try {
    actionLoading.value = true;
    await rejectBookingBySitter(bookingId.value);
    invalidateSitterBookingsListCache();
    showToast("Booking declined", "success");
    showRejectModal.value = false;
    await loadDetail();
  } catch {
    showToast("Failed to decline booking", "error");
  } finally {
    actionLoading.value = false;
  }
}

async function startInService() {
  try {
    actionLoading.value = true;
    await startInServiceBySitter(bookingId.value);
    invalidateSitterBookingsListCache();
    showToast("You are now in service", "success");
    await loadDetail();
  } catch (error) {
    showToast(extractErrorMessage(error, "Failed to start service"), "error");
  } finally {
    actionLoading.value = false;
  }
}

async function completeBooking() {
  try {
    actionLoading.value = true;
    await completeBookingBySitter(bookingId.value);
    invalidateSitterBookingsListCache();
    showToast("Booking marked as success", "success");
    await loadDetail();
  } catch (error) {
    showToast(extractErrorMessage(error, "Failed to complete booking"), "error");
  } finally {
    actionLoading.value = false;
  }
}

onMounted(() => {
  if (!Number.isFinite(bookingId.value)) {
    router.push({ name: "sitter-booking-list" });
    return;
  }
  void loadDetail();
});
</script>

<template>
  <section class="space-y-4">
    <nav class="body-3 text-brand-gray-500" aria-label="Breadcrumb">
      <RouterLink
        :to="{ name: 'sitter-booking-list' }"
        class="text-brand-orange-700 transition hover:text-brand-orange-500"
      >
        Booking list
      </RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-brand-gray-900">Booking detail</span>
    </nav>

    <header
      v-if="!loading && booking"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <div class="flex flex-wrap items-center gap-3">
        <RouterLink
          :to="{ name: 'sitter-booking-list' }"
          class="body-2 text-brand-gray-700 transition hover:text-brand-orange-700"
          aria-label="Back to booking list"
        >
          ←
        </RouterLink>
        <h1 class="headline-4 text-brand-gray-900">{{ ownerDisplayName }}</h1>
        <span
          class="body-3"
          :class="
            isActivelyInService
              ? 'text-brand-blue-500'
              : isWaitingForService
                ? 'text-brand-orange-700'
                : booking?.status === 'COMPLETED'
                  ? 'text-brand-green-500'
                  : booking?.status === 'IN_SERVICE'
                    ? 'text-brand-blue-500'
                  : booking?.status === 'CANCELLED'
                    ? 'text-brand-red-500'
                    : 'text-brand-pink-500'
          "
        >
          • {{ statusLabel }}
        </span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="isWaiting"
          type="button"
          class="cursor-pointer rounded-full bg-brand-pink-50 px-4 py-2 body-3 text-brand-pink-500 transition hover:bg-brand-pink-500 hover:text-brand-white"
          :disabled="actionLoading"
          @click="showRejectModal = true"
        >
          Reject
        </button>
        <button
          v-if="isWaiting"
          type="button"
          class="cursor-pointer rounded-full bg-brand-orange-700 px-4 py-2 body-3 text-brand-white transition hover:bg-brand-orange-500"
          :disabled="actionLoading"
          @click="showConfirmModal = true"
        >
          Confirm
        </button>
        <button
          v-if="isWaitingForService"
          type="button"
          class="cursor-pointer rounded-full bg-brand-orange-700 px-4 py-2 body-3 text-brand-white transition hover:bg-brand-orange-500"
          :disabled="actionLoading"
          @click="startInService"
        >
          In Service
        </button>
        <!-- Future fallback for time-gated success:
        :title="!canMarkSuccess ? 'Available after booking end time' : undefined"<< เช็คเวลาเสร็จสิ้นการบริการ ก่อนถึงจะสามารถกดปุ่มsuccessได้ ป้องกันsitterแอบกดปุ่มเสร็จงานก่อนกำหนด (เผื่อใช้ในอนาคต)>>
        --> 
        <button
          v-if="isActivelyInService"
          type="button"
          class="cursor-pointer rounded-full bg-brand-orange-700 px-4 py-2 body-3 text-brand-white transition hover:bg-brand-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="actionLoading || !canMarkSuccess"
          @click="completeBooking"
        >
          Success
        </button>
      </div>
    </header>

    <article
      v-if="loading"
      class="rounded-2xl bg-brand-white p-8 shadow-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex items-center justify-center gap-3">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-brand-orange-700 border-t-transparent"></div>
        <p class="body-2 text-brand-gray-500">Loading booking detail...</p>
      </div>
    </article>

    <article v-else-if="booking" class="space-y-6 rounded-2xl bg-brand-white p-6 shadow-sm">
      <section class="flex items-start justify-between">
        <div>
          <p class="body-3 text-brand-gray-500">Pet Owner Name</p>
          <p class="body-2 text-brand-gray-900">{{ ownerDisplayName }}</p>
        </div>
        <button
          type="button"
          class="cursor-pointer body-3 text-brand-orange-700 transition hover:text-brand-orange-500"
          @click="showOwnerModal = true"
        >
          View Profile
        </button>
      </section>

      <section>
        <p class="body-3 text-brand-gray-500">Pet(s)</p>
        <p class="body-2 text-brand-gray-900">{{ booking.petIds.length }}</p>
      </section>

      <section>
        <p class="body-3 text-brand-gray-500">Pet Detail</p>
        <div class="mt-2 flex flex-wrap gap-3">
          <button
            v-for="pet in pets"
            :key="pet.id"
            type="button"
            class="cursor-pointer rounded-xl border border-brand-gray-100 p-3 text-left transition hover:border-brand-orange-300"
            @click="openPetDetail(pet.id)"
          >
            <img :src="pet.imageUrl" :alt="`Photo of ${pet.name}`" class="h-16 w-16 rounded-full object-cover" />
            <p class="body-3 mt-2 text-brand-gray-900">{{ pet.name }}</p>
            <p class="body-3 text-brand-gray-500">{{ pet.type }}</p>
          </button>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p class="body-3 text-brand-gray-500">Duration</p>
          <p class="body-2 text-brand-gray-900">{{ booking.totalHours }} hours</p>
        </div>
        <div>
          <p class="body-3 text-brand-gray-500">Booking Date</p>
          <p class="body-2 text-brand-gray-900">{{ booking.startDate }} | {{ booking.startTime }} - {{ booking.endTime }}</p>
        </div>
        <div>
          <p class="body-3 text-brand-gray-500">Total Paid</p>
          <p class="body-2 text-brand-gray-900">{{ booking.totalPrice }} THB</p>
        </div>
        <div>
          <p class="body-3 text-brand-gray-500">Transaction Date</p>
          <p class="body-2 text-brand-gray-900">{{ transactionDateLabel }}</p>
        </div>
        <div>
          <p class="body-3 text-brand-gray-500">Transaction No.</p>
          <p class="body-2 text-brand-gray-900">#{{ booking.id }}</p>
        </div>
        <div>
          <p class="body-3 text-brand-gray-500">Additional Message</p>
          <p class="body-2 text-brand-gray-900">{{ booking.noteToSitter || "-" }}</p>
        </div>
      </section>
    </article>

    <div
      v-if="showConfirmModal || showRejectModal || showPetModal || showOwnerModal"
      class="fixed inset-0 z-80 flex items-center justify-center bg-black/35 px-4"
      @click.self="showConfirmModal = false; showRejectModal = false; showPetModal = false; showOwnerModal = false"
    >
      <BookingConfirm
        v-if="showConfirmModal"
        message="Are you sure you want to confirm this booking?"
        confirm-label="Confirm Booking"
        @cancel="showConfirmModal = false"
        @confirm="confirmBooking"
      />

      <section v-else-if="showRejectModal" class="w-full max-w-xl rounded-2xl bg-brand-white p-6 shadow-xl">
        <SitterRejectConfirmPopup
          message="Are you sure you want to reject this booking?"
          confirm-label="Reject Booking"
          @cancel="showRejectModal = false"
          @confirm="rejectBooking"
        />
      </section>

      <SitterPetDetailModal v-else-if="showPetModal" :pet="selectedPet" @close="showPetModal = false" />

      <SitterOwnerProfileModal
        v-else-if="showOwnerModal"
        :profile="ownerProfile"
        @close="showOwnerModal = false"
      />
    </div>
  </section>
</template>
