<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getBookingById, type BookingResponse } from "@/services/booking.service";
import { getPetsByUserId, type PetResponse } from "@/services/pet.service";
import { useToast } from "@/composables/useToast";

const props = defineProps<{ bookingId: number }>();
defineEmits<{ close: [] }>();

const { showToast } = useToast();

const booking = ref<BookingResponse | null>(null);
const pets = ref<PetResponse[]>([]);
const loading = ref(false);

const ownerName = computed(() =>
  booking.value?.ownerName || (booking.value ? `User #${booking.value.userId}` : "")
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

const bookingDateLabel = computed(() => {
  if (!booking.value) return "-";
  const { startDate, endDate, startTime, endTime } = booking.value;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const endDay = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const fmt = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return m === "00" ? `${display} ${suffix}` : `${display}:${m} ${suffix}`;
  };
  if (startDay === endDay) return `${startDay} | ${fmt(startTime)} - ${fmt(endTime)}`;
  return `${startDay} ${fmt(startTime)} - ${endDay} ${fmt(endTime)}`;
});

async function loadDetail() {
  try {
    loading.value = true;
    const { data } = await getBookingById(props.bookingId);
    booking.value = data;

    const petRes = await getPetsByUserId(data.userId);
    pets.value = petRes.data.filter((p) => data.petIds.includes(p.id));
  } catch {
    showToast("Failed to load booking detail", "error");
  } finally {
    loading.value = false;
  }
}

onMounted(() => void loadDetail());
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @click.self="$emit('close')"
  >
    <section class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-brand-white p-8 shadow-xl">
      <header class="mb-6 flex items-center justify-between">
        <h2 class="headline-4 text-brand-gray-900">{{ ownerName || "Booking Detail" }}</h2>
        <button
          type="button"
          class="cursor-pointer text-2xl text-brand-gray-300 transition hover:text-brand-gray-700"
          aria-label="Close"
          @click="$emit('close')"
        >
          ✕
        </button>
      </header>

      <div v-if="loading" class="py-12 text-center body-3 text-brand-gray-500">Loading...</div>

      <article v-else-if="booking" class="space-y-6">
        <section>
          <p class="body-3 text-brand-gray-500">Pet Owner Name</p>
          <p class="body-2 text-brand-gray-900">{{ ownerName }}</p>
        </section>

        <section>
          <p class="body-3 text-brand-gray-500">Pet(s)</p>
          <p class="body-2 text-brand-gray-900">{{ booking.petIds.length }}</p>
        </section>

        <section>
          <p class="body-3 text-brand-gray-500 mb-2">Pet Detail</p>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="pet in pets"
              :key="pet.id"
              class="flex flex-col items-center gap-2 rounded-xl border border-brand-gray-100 p-4 w-36"
            >
              <img
                :src="pet.imageUrl"
                :alt="`Photo of ${pet.name}`"
                class="h-16 w-16 rounded-full object-cover"
              />
              <p class="body-3 text-brand-gray-900 font-medium">{{ pet.name }}</p>
              <span class="rounded-full border border-brand-green-500 px-3 py-0.5 body-3 text-brand-green-500 text-xs">
                {{ pet.type }}
              </span>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p class="body-3 text-brand-gray-500">Duration</p>
            <p class="body-2 text-brand-gray-900">{{ booking.totalHours }} hours</p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500">Booking Date</p>
            <p class="body-2 text-brand-gray-900">{{ bookingDateLabel }}</p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500">Total Paid</p>
            <p class="body-2 text-brand-gray-900">{{ Number(booking.totalPrice).toFixed(2) }} THB</p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500">Transaction Date</p>
            <p class="body-2 text-brand-gray-900">{{ transactionDateLabel }}</p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500">Transaction No.</p>
            <p class="body-2 text-brand-gray-900">{{ booking.id }}</p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500">Additional Message</p>
            <p class="body-2 text-brand-gray-900">{{ booking.noteToSitter || "-" }}</p>
          </div>
        </section>
      </article>
    </section>
  </div>
</template>
