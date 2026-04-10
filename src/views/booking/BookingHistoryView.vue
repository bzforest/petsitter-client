<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import apiClient from "@/api/axios";
import BookingCard from "@/components/ui/BookingCard.vue";
import PaginationField from "@/components/ui/PaginationField.vue";
import BookingDateTimeModal from "@/components/booking/BookingDateTimeModal.vue";
import BookingDetailModal from "@/components/booking/BookingDetailModal.vue";
import ReviewModal from "@/components/booking/ReviewModal.vue";
import ReportModal from "@/components/booking/ReportModal.vue";
import ReportSuccessModal from "@/components/booking/ReportSuccessModal.vue";
import ReportDuplicateModal from "@/components/booking/ReportDuplicateModal.vue";
import { PawPrint } from "lucide-vue-next";
import Button from "@/components/ui/Button.vue";

interface Booking {
  id: number;
  sitterId: number;
  sitterName: string;
  sitterFullName: string;
  sitterProfileId: number;
  sitterProfileImage?: string | null;
  ownerName: string;
  petNames: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalHours?: number;
  totalPrice: number;
  status: string;
  reviewId?: number | null;
  createdAt?: any;
}

const bookings = ref<Booking[]>([]);
const isLoading = ref(true);

// Pagination State (Synced with Server-side)
const currentPage = ref(1); // UI is 1-indexed
const itemsPerPage = 4;
const totalPages = ref(0);
const totalElements = ref(0);

// Modal State
const isDateTimeModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const isReviewModalOpen = ref(false);
const isSubmittingUpdate = ref(false);
const editingBooking = ref<Booking | null>(null);
const selectedDetailBooking = ref<Booking | null>(null);

// Report State
const isReportModalOpen = ref(false);
const isReportSuccessModalOpen = ref(false);
const isReportDuplicateModalOpen = ref(false);
const reportingBooking = ref<Booking | null>(null);

const handleOpenReportModal = (booking: Booking) => {
  reportingBooking.value = booking;
  isReportModalOpen.value = true;
};

// Review State
const reviewMode = ref<'create' | 'edit'>('create');
const currentReviewData = ref<{ rating: number; comment: string; id: number | null }>({
  rating: 0,
  comment: '',
  id: null
});

onMounted(async () => {
  fetchBookings();
});

// Watch for page changes
watch(currentPage, () => {
  fetchBookings();
});

const fetchBookings = async () => {
  isLoading.value = true;
  try {
    // Spring Data JPA is 0-indexed, UI is 1-indexed
    const pageIndex = currentPage.value - 1;
    const { data } = await apiClient.get(`/api/bookings/user/me?page=${pageIndex}&size=${itemsPerPage}`);
    // Page response has 'content', 'totalPages', 'totalElements'
    bookings.value = data.content;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
  } catch (err) {
    console.error("Failed to fetch bookings", err);
  } finally {
    isLoading.value = false;
  }
};

// Helper: Check if can change (must be > 1 hour before start)
const checkCanChange = (booking: Booking) => {
  if (booking.status !== "PENDING" && booking.status !== "PAID" && booking.status !== "CONFIRMED") return false;
  
  try {
    const now = new Date();
    const bookingStart = new Date(`${booking.startDate}T${booking.startTime}+07:00`);
    
    // Difference in milliseconds
    const diff = bookingStart.getTime() - now.getTime();
    const diffHours = diff / (1000 * 60 * 60);
    
    return diffHours >= 1;
  } catch (e) {
    return false;
  }
};

const handleOpenChangeModal = (booking: Booking) => {
  editingBooking.value = booking;
  isDateTimeModalOpen.value = true;
  // If detail modal was open, close it (UX choice)
  isDetailModalOpen.value = false;
};

const handleOpenDetailModal = (booking: Booking) => {
  selectedDetailBooking.value = booking;
  isDetailModalOpen.value = true;
};

const handleOpenReviewModal = async (booking: Booking) => {
  editingBooking.value = booking;
  if (booking.reviewId) {
    reviewMode.value = 'edit';
    try {
      const { data } = await apiClient.get(`/api/reviews/booking/${booking.id}`);
      currentReviewData.value = {
        rating: data.rating,
        comment: data.comment,
        id: data.id
      };
    } catch (err) {
      console.error("Failed to fetch review data", err);
      return;
    }
  } else {
    reviewMode.value = 'create';
    currentReviewData.value = { rating: 0, comment: '', id: null };
  }
  isReviewModalOpen.value = true;
};

const handleUpdateBooking = async () => {
  const { useBookingStore } = await import("@/stores/bookingStore");
  const bookingStore = useBookingStore();

  if (!editingBooking.value) return;

  isSubmittingUpdate.value = true;
  try {
    await apiClient.patch(`/api/bookings/${editingBooking.value.id}/datetime`, {
      startDate: bookingStore.date,
      endDate: bookingStore.date,
      startTime: bookingStore.startTime,
      endTime: bookingStore.endTime
    });
    
    // SUCCESS! Wait for data to refresh on screen BEFORE closing
    await fetchBookings();
    
    isDateTimeModalOpen.value = false;
    editingBooking.value = null;
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to update booking time");
  } finally {
    isSubmittingUpdate.value = false;
  }
};

// Helper: Map Backend Status to BookingCard Status
const getBookingCardStatus = (booking: Booking): 'waiting' | 'confirmed' | 'in_service' | 'success' | 'cancelled' => {
  if (booking.status === "CANCELLED") return "cancelled";
  if (booking.status === "COMPLETED") return "success";
  if (booking.status === "IN_SERVICE") return "in_service";
  if (booking.status === "CONFIRMED") return "confirmed";
  
  return "waiting";
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  return timeStr.split(":").slice(0, 2).join(":");
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans relative overflow-hidden">

    <main class="flex-1 container mx-auto lg:px-4 max-w-4xl z-10">
      <div class="flex items-center gap-4 mb-10">
        <h1 class="headline-3 text-brand-gray-900">Booking History</h1>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-32">
        <div class="w-12 h-12 border-4 border-brand-orange-50 border-t-brand-orange-500 rounded-full animate-spin"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm">
        <div class="w-24 h-24 bg-brand-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <PawPrint class="w-12 h-12 text-brand-gray-300" />
        </div>
        <h3 class="headline-3 text-brand-gray-900 mb-2">No Bookings Found</h3>
        <p class="body-2 text-brand-gray-500 mb-8">You haven't booked any pet sitters yet.</p>
        <router-link to="/">
          <Button variant="primary" class="cursor-pointer">
            Find a Sitter
          </Button>
        </router-link>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-6">
        <BookingCard
          v-for="booking in bookings"
          :key="booking.id"
          :partnerId="booking.sitterId"
          :sitterName="booking.sitterName"
          :ownerName="booking.sitterFullName"
          :transactionDate="formatDate(booking.createdAt)"
          :status="getBookingCardStatus(booking)"
          :bookingDate="formatDate(booking.startDate)"
          :bookingTime="`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`"
          :duration="`${booking.totalHours || 0} hours`"
          :petName="booking.petNames.join(', ')"
          :sitterAvatarUrl="booking.sitterProfileImage || undefined"
          :successDate="booking.status === 'COMPLETED' ? formatDate(booking.endDate) : undefined"
          :canChange="checkCanChange(booking)"
          :isReviewed="!!booking.reviewId"
          @click="handleOpenDetailModal(booking)"
          @open-change="handleOpenChangeModal(booking)"
          @review="handleOpenReviewModal(booking)"
          @report="handleOpenReportModal(booking)"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pt-8 flex justify-center">
          <PaginationField 
            :total-pages="totalPages"
            v-model:current-page="currentPage"
          />
        </div>
      </div>
    </main>

    <!-- Modal for Detail -->
    <BookingDetailModal 
      v-if="isDetailModalOpen && selectedDetailBooking"
      :booking="selectedDetailBooking"
      :canChange="checkCanChange(selectedDetailBooking)"
      @close="isDetailModalOpen = false"
      @open-change="handleOpenChangeModal(selectedDetailBooking)"
    />

    <!-- Modal for editing date/time -->
    <BookingDateTimeModal 
      v-if="isDateTimeModalOpen && editingBooking"
      :sitterId="editingBooking.sitterId"
      :isSubmitting="isSubmittingUpdate"
      mode="update"
      @close="isDateTimeModalOpen = false"
      @confirm="handleUpdateBooking"
    />

    <!-- Modal for Report -->
    <ReportModal
      v-if="isReportModalOpen && reportingBooking"
      :bookingId="reportingBooking.id"
      @close="isReportModalOpen = false"
      @success="isReportModalOpen = false; isReportSuccessModalOpen = true"
      @already-reported="isReportDuplicateModalOpen = true"
    />

    <!-- Modal for Report Success -->
    <ReportSuccessModal
      v-if="isReportSuccessModalOpen"
      @close="isReportSuccessModalOpen = false"
    />

    <!-- Modal for Duplicate Report -->
    <ReportDuplicateModal
      v-if="isReportDuplicateModalOpen"
      @close="isReportDuplicateModalOpen = false"
    />

    <!-- Modal for Review -->
    <ReviewModal
      v-if="isReviewModalOpen && editingBooking"
      :bookingId="editingBooking.id"
      :sitterId="editingBooking.sitterId"
      :mode="reviewMode"
      :reviewId="currentReviewData.id"
      :initialRating="currentReviewData.rating"
      :initialComment="currentReviewData.comment"
      @close="isReviewModalOpen = false"
      @success="fetchBookings"
    />

  </div>
</template>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
