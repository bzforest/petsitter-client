<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getSitterBookings, type BookingResponse, type BookingStatusApi } from "@/services/booking.service";
import { getOwnerProfileByUserId } from "@/services/userProfile.service";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const { showToast } = useToast();

const loading = ref(false);
const bookings = ref<BookingResponse[]>([]);
const ownerNameByUserId = ref<Record<number, string>>({});
const pageSize = 10;
const currentPage = ref(0);
const totalPages = ref(1);
const totalElements = ref(0);

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
      ownerName: ownerNameByUserId.value[b.userId] || `User #${b.userId}`,
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

async function loadOwnerNames(items: BookingResponse[]) {
  const uniqueUserIds = Array.from(new Set(items.map((item) => item.userId)));
  if (uniqueUserIds.length === 0) return;

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      // Keep cached names to avoid duplicate requests between page switches.
      if (ownerNameByUserId.value[userId]) return;
      try {
        const { data } = await getOwnerProfileByUserId(userId);
        const name = data.fullName?.trim() || data.email?.trim() || `User #${userId}`;
        ownerNameByUserId.value[userId] = name;
      } catch {
        ownerNameByUserId.value[userId] = `User #${userId}`;
      }
    })
  );
}

const pageStart = computed(() => (totalElements.value === 0 ? 0 : currentPage.value * pageSize + 1));
const pageEnd = computed(() => Math.min((currentPage.value + 1) * pageSize, totalElements.value));

async function loadBookings(page = currentPage.value) {
  try {
    loading.value = true;
    const res = await getSitterBookings(page, pageSize);
    bookings.value = res.content;
    currentPage.value = res.number;
    totalPages.value = Math.max(1, res.totalPages);
    totalElements.value = res.totalElements;
    await loadOwnerNames(res.content);
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
            <td class="px-4 py-3">{{ row.ownerName }}</td>
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

      <footer
        v-if="!loading && totalElements > 0"
        class="flex items-center justify-between border-t border-brand-gray-100 px-4 py-3"
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
