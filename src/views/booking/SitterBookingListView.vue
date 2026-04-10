<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getSitterBookingsListSnapshot,
  getSitterBookingsPageWithCache,
  type BookingResponse,
  type BookingStatusApi,
} from "@/services/booking.service";
import { useToast } from "@/composables/useToast";

defineOptions({ name: "SitterBookingList" });

const router = useRouter();
const { showToast } = useToast();

const loading = ref(false);
const bookings = ref<BookingResponse[]>([]);
const pageSize = 10;
const currentPage = ref(0);
const totalPages = ref(1);
const totalElements = ref(0);
const listPrimed = ref(false);

function labelFromStatus(status: BookingStatusApi) {
  if (status === "CONFIRMED") return "Waiting for service";
  if (status === "IN_SERVICE") return "In service";
  if (status === "COMPLETED") return "Success";
  if (status === "CANCELLED") return "Cancelled";
  return "Waiting for confirm";
}

function classFromStatus(status: BookingStatusApi) {
  if (status === "CONFIRMED") return "text-brand-orange-700";
  if (status === "IN_SERVICE") return "text-brand-blue-500";
  if (status === "COMPLETED") return "text-brand-green-500";
  if (status === "CANCELLED") return "text-brand-red-500";
  return "text-brand-pink-500";
}

const rows = computed(() =>
  [...bookings.value]
    .sort((a, b) => {
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aCreated !== bCreated) return bCreated - aCreated;

      const aStart = new Date(`${a.startDate}T${a.startTime}`).getTime();
      const bStart = new Date(`${b.startDate}T${b.startTime}`).getTime();
      if (aStart !== bStart) return bStart - aStart;

      return b.id - a.id;
    })
    .map((b) => ({
      ...b,
      ownerName: b.ownerName?.trim() || `User #${b.userId}`,
      schedule: `${b.startDate} ${b.startTime} - ${b.endTime}`,
      petsCount: b.petIds.length,
      transactionNo: b.id,
      transactionDate: b.createdAt
        ? new Date(b.createdAt).toLocaleDateString("en-GB")
        : b.startDate
          ? new Date(b.startDate).toLocaleDateString("en-GB")
          : "-",
    }))
);

const pageStart = computed(() => (totalElements.value === 0 ? 0 : currentPage.value * pageSize + 1));
const pageEnd = computed(() => Math.min((currentPage.value + 1) * pageSize, totalElements.value));

function applyBookingsPage(res: {
  content: BookingResponse[];
  number: number;
  totalPages: number;
  totalElements: number;
}) {
  bookings.value = res.content;
  currentPage.value = res.number;
  totalPages.value = Math.max(1, res.totalPages);
  totalElements.value = res.totalElements;
}

async function loadBookings(page = currentPage.value) {
  const snap = getSitterBookingsListSnapshot(page, pageSize);
  if (snap) {
    applyBookingsPage(snap);
    loading.value = false;
  } else {
    loading.value = true;
  }
  try {
    const res = await getSitterBookingsPageWithCache(page, pageSize, !!snap);
    applyBookingsPage(res);
  } catch {
    showToast("Failed to load booking list", "error");
  } finally {
    loading.value = false;
  }
}

function openDetail(id: number) {
  router.push({ name: "sitter-booking-detail", params: { id } });
}

function goToPage(page: number) {
  if (page < 0 || page >= totalPages.value || page === currentPage.value || loading.value) return;
  void loadBookings(page);
}

onMounted(async () => {
  await loadBookings();
  listPrimed.value = true;
});

onActivated(() => {
  if (!listPrimed.value) return;
  void loadBookings();
});
</script>

<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="headline-4 text-brand-gray-900">Booking List</h1>
    </header>

    <article class="overflow-hidden rounded-2xl border border-brand-gray-100 bg-brand-white">
      <!-- Mobile card list (no horizontal scroll) -->
      <section class="space-y-3 p-3 md:hidden">
        <article v-if="loading" class="rounded-xl border border-brand-gray-100 px-4 py-6 text-center body-3 text-brand-gray-500">
          Loading...
        </article>
        <article v-else-if="rows.length === 0" class="rounded-xl border border-brand-gray-100 px-4 py-6 text-center body-3 text-brand-gray-500">
          No booking found
        </article>
        <article
          v-for="row in rows"
          :key="`mobile-${row.id}`"
          class="space-y-2 rounded-xl border border-brand-gray-100 p-3"
        >
          <header class="flex items-start justify-between gap-3">
            <p class="body-2 text-brand-gray-900">{{ row.ownerName }}</p>
            <span class="body-3" :class="classFromStatus(row.status)">{{ labelFromStatus(row.status) }}</span>
          </header>
          <p class="body-3 text-brand-gray-600">{{ row.schedule }}</p>
          <section class="flex items-center justify-between">
            <p class="body-3 text-brand-gray-500">Pet(s): {{ row.petsCount }}</p>
            <p class="body-3 text-brand-gray-500">#{{ row.transactionNo }}</p>
          </section>
          <section class="flex items-center justify-between">
            <p class="body-3 text-brand-gray-500">Transaction: {{ row.transactionDate }}</p>
            <button
              type="button"
              class="cursor-pointer body-3 text-brand-orange-700 transition hover:text-brand-orange-500"
              @click="openDetail(row.id)"
            >
              View Detail
            </button>
          </section>
        </article>
      </section>

      <!-- Desktop table -->
      <section class="hidden overflow-x-auto md:block">
        <table class="w-full min-w-[920px] border-collapse">
        <thead class="bg-brand-black text-brand-white">
          <tr class="body-3">
            <th class="px-3 py-3 text-left md:px-4">Pet Owner Name</th>
            <th class="px-3 py-3 text-left md:px-4">Pet(s)</th>
            <th class="px-3 py-3 text-left md:px-4">Booking Date</th>
            <th class="px-3 py-3 text-left md:px-4">Transaction Date</th>
            <th class="px-3 py-3 text-left md:px-4">Transaction No.</th>
            <th class="px-3 py-3 text-left md:px-4">Status</th>
            <th class="px-3 py-3 text-left md:px-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-8 text-center body-3 text-brand-gray-500">Loading...</td>
          </tr>
          <tr v-else-if="rows.length === 0">
            <td colspan="7" class="px-4 py-8 text-center body-3 text-brand-gray-500">No booking found</td>
          </tr>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-t border-brand-gray-100 body-3 text-brand-gray-700"
          >
            <td class="px-3 py-3 md:px-4">{{ row.ownerName }}</td>
            <td class="px-3 py-3 md:px-4">{{ row.petsCount }}</td>
            <td class="px-3 py-3 md:px-4">{{ row.schedule }}</td>
            <td class="px-3 py-3 md:px-4">{{ row.transactionDate }}</td>
            <td class="px-3 py-3 md:px-4">#{{ row.transactionNo }}</td>
            <td class="px-3 py-3 md:px-4">
              <span :class="classFromStatus(row.status)">{{ labelFromStatus(row.status) }}</span>
            </td>
            <td class="px-3 py-3 md:px-4">
              <button
                type="button"
                class="cursor-pointer text-brand-orange-700 transition hover:text-brand-orange-500"
                @click="openDetail(row.id)"
              >
                View Detail
              </button>
            </td>
          </tr>
        </tbody>
        </table>
      </section>

      <footer
        v-if="!loading && totalElements > 0"
        class="flex flex-col items-start justify-between gap-2 border-t border-brand-gray-100 px-4 py-3 sm:flex-row sm:items-center"
      >
        <p class="body-3 text-brand-gray-500">
          Showing {{ pageStart }}-{{ pageEnd }} of {{ totalElements }}
        </p>

        <section class="flex items-center gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-brand-gray-100 px-3 py-1 body-3 text-brand-gray-700 transition hover:bg-brand-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage === 0"
            @click="goToPage(currentPage - 1)"
          >
            Prev
          </button>
          <p class="body-3 text-brand-gray-700">
            Page {{ currentPage + 1 }} / {{ totalPages }}
          </p>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-brand-gray-100 px-3 py-1 body-3 text-brand-gray-700 transition hover:bg-brand-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage >= totalPages - 1"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </section>
      </footer>
    </article>
  </section>
</template>
