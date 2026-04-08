<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getSitterBookings, type BookingResponse, type BookingStatusApi } from "@/services/booking.service";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const { showToast } = useToast();

const loading = ref(false);
const bookings = ref<BookingResponse[]>([]);

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
      const aMs = new Date(`${a.startDate}T${a.startTime}`).getTime();
      const bMs = new Date(`${b.startDate}T${b.startTime}`).getTime();
      if (aMs !== bMs) return aMs - bMs;
      return a.id - b.id;
    })
    .map((b) => ({
      ...b,
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

async function loadBookings() {
  try {
    loading.value = true;
    bookings.value = await getSitterBookings();
  } catch {
    showToast("Failed to load booking list", "error");
  } finally {
    loading.value = false;
  }
}

function openDetail(id: number) {
  router.push({ name: "sitter-booking-detail", params: { id } });
}

onMounted(() => {
  void loadBookings();
});
</script>

<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="headline-4 text-brand-gray-900">Booking List</h1>
    </header>

    <article class="overflow-hidden rounded-2xl border border-brand-gray-100 bg-brand-white">
      <table class="w-full border-collapse">
        <thead class="bg-brand-black text-brand-white">
          <tr class="body-3">
            <th class="px-4 py-3 text-left">Pet Owner Name</th>
            <th class="px-4 py-3 text-left">Pet(s)</th>
            <th class="px-4 py-3 text-left">Booking Date</th>
            <th class="px-4 py-3 text-left">Transaction Date</th>
            <th class="px-4 py-3 text-left">Transaction No.</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left"></th>
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
            <td class="px-4 py-3">{{ `User #${row.userId}` }}</td>
            <td class="px-4 py-3">{{ row.petsCount }}</td>
            <td class="px-4 py-3">{{ row.schedule }}</td>
            <td class="px-4 py-3">{{ row.transactionDate }}</td>
            <td class="px-4 py-3">#{{ row.transactionNo }}</td>
            <td class="px-4 py-3">
              <span :class="classFromStatus(row.status)">{{ labelFromStatus(row.status) }}</span>
            </td>
            <td class="px-4 py-3">
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
    </article>
  </section>
</template>
