<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft, ChevronRight, Clock3, Search } from "lucide-vue-next";
import SitterCalendarLegend from "@/components/booking/SitterCalendarLegend.vue";
import SitterCalendarGrid from "@/components/booking/SitterCalendarGrid.vue";
import SitterCalendarMonthGrid from "@/components/booking/SitterCalendarMonthGrid.vue";
import { getMySitterCalendar, type SitterCalendarItemResponse } from "@/services/sitterCalendar.service";
import { useToast } from "@/composables/useToast";

defineOptions({ name: "SitterCalendar" });

const router = useRouter();
const { showToast } = useToast();

const loading = ref(false);
const calendarItems = ref<SitterCalendarItemResponse[]>([]);
const anchorDate = ref(new Date());
const searchQuery = ref("");
const viewMode = ref<"week" | "month">("week");

function weekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 sunday ... 6 saturday
  const diff = day === 0 ? -6 : 1 - day; // start Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const weekDays = computed(() => {
  const start = weekStart(anchorDate.value);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
});

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const weekRangeLabel = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[6];
  return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
});

const monthLabel = computed(() => {
  return anchorDate.value.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
});

const monthDays = computed(() => {
  const y = anchorDate.value.getFullYear();
  const m = anchorDate.value.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const mondayOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - mondayOffset);

  const sundayOffset = 6 - ((last.getDay() + 6) % 7);
  const gridEnd = new Date(last);
  gridEnd.setDate(last.getDate() + sundayOffset);

  const days: Date[] = [];
  const cur = new Date(gridStart);
  while (cur <= gridEnd) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
});

const filteredCalendarItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return calendarItems.value;
  return calendarItems.value.filter((item) => {
    const owner = item.ownerName?.toLowerCase() ?? "";
    const idText = String(item.bookingId);
    return owner.includes(q) || idText.includes(q);
  });
});

const mobileAgendaItems = computed(() => {
  return [...filteredCalendarItems.value]
    .sort((a, b) => {
      const aMs = new Date(`${a.startDate}T${a.startTime}`).getTime();
      const bMs = new Date(`${b.startDate}T${b.startTime}`).getTime();
      if (aMs !== bMs) return aMs - bMs;
      return a.bookingId - b.bookingId;
    });
});

const mobileAgendaGroups = computed(() => {
  const grouped = new Map<string, SitterCalendarItemResponse[]>();
  for (const item of mobileAgendaItems.value) {
    const list = grouped.get(item.startDate) ?? [];
    list.push(item);
    grouped.set(item.startDate, list);
  }
  return Array.from(grouped.entries()).map(([date, items]) => ({ date, items }));
});

function mobileStatusClass(status: SitterCalendarItemResponse["status"]): string {
  if (status === "PENDING" || status === "PAID") return "text-brand-pink-500";
  if (status === "CONFIRMED") return "text-brand-orange-700";
  if (status === "IN_SERVICE") return "text-brand-blue-500";
  if (status === "COMPLETED") return "text-brand-green-500";
  return "text-brand-gray-500";
}

function statusLabel(status: SitterCalendarItemResponse["status"]): string {
  if (status === "PENDING" || status === "PAID") return "Waiting for confirm";
  if (status === "CONFIRMED") return "Waiting for service";
  if (status === "IN_SERVICE") return "In service";
  if (status === "COMPLETED") return "Success";
  return "Unknown";
}

function mobileDateLabel(dateText: string): string {
  const dt = new Date(dateText);
  if (Number.isNaN(dt.getTime())) return dateText;
  return dt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadCalendar() {
  try {
    loading.value = true;
    const rangeStart = viewMode.value === "week" ? weekDays.value[0] : monthDays.value[0];
    const rangeEnd =
      viewMode.value === "week" ? weekDays.value[6] : monthDays.value[monthDays.value.length - 1];
    const startDate = formatIsoDate(rangeStart);
    const endDate = formatIsoDate(rangeEnd);
    const { data } = await getMySitterCalendar(startDate, endDate);
    calendarItems.value = data;
  } catch {
    showToast("Failed to load calendar data", "error");
  } finally {
    loading.value = false;
  }
}

function goPrevWeek() {
  const d = new Date(anchorDate.value);
  if (viewMode.value === "week") {
    d.setDate(d.getDate() - 7);
  } else {
    d.setMonth(d.getMonth() - 1);
  }
  anchorDate.value = d;
  void loadCalendar();
}

function goNextWeek() {
  const d = new Date(anchorDate.value);
  if (viewMode.value === "week") {
    d.setDate(d.getDate() + 7);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  anchorDate.value = d;
  void loadCalendar();
}

function goToday() {
  anchorDate.value = new Date();
  void loadCalendar();
}

function openBookingDetail(bookingId: number) {
  router.push({ name: "sitter-booking-detail", params: { id: bookingId } });
}

onMounted(() => {
  void loadCalendar();
});
</script>

<template>
  <section class="space-y-4 rounded-2xl bg-brand-white p-3 shadow-sm sm:p-4 md:p-5">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="headline-4 text-brand-gray-900">Calendar</h1>

      <section class="relative w-full max-w-xs">
        <label for="calendar-search" class="sr-only">Search booking</label>
        <input
          id="calendar-search"
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full rounded-md border border-brand-gray-100 bg-brand-white py-2 pl-3 pr-9 body-3 text-brand-gray-700 outline-none transition focus:border-brand-orange-300"
        />
        <Search class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-300" />
      </section>
    </header>

    <section class="flex flex-wrap items-center justify-between gap-3">
      <section class="flex w-full flex-wrap items-center gap-2 lg:w-auto">
        <Clock3 class="h-4 w-4 text-brand-gray-300" />
        <section class="mr-1 flex items-center rounded-full border border-brand-gray-100 p-1">
          <button
            type="button"
            class="cursor-pointer rounded-full px-3 py-1 body-3 transition"
            :class="viewMode === 'week' ? 'bg-brand-orange-50 text-brand-orange-700' : 'text-brand-gray-500'"
            @click="viewMode = 'week'; void loadCalendar()"
          >
            Week
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-full px-3 py-1 body-3 transition"
            :class="viewMode === 'month' ? 'bg-brand-orange-50 text-brand-orange-700' : 'text-brand-gray-500'"
            @click="viewMode = 'month'; void loadCalendar()"
          >
            Month
          </button>
        </section>
        <button
          type="button"
          class="cursor-pointer rounded-full bg-brand-orange-50 px-4 py-2 body-3 text-brand-orange-700 transition hover:bg-brand-orange-100"
          @click="goToday"
        >
          Today
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-full border border-brand-gray-100 p-2 body-3 text-brand-gray-700 transition hover:bg-brand-gray-50"
          @click="goPrevWeek"
          aria-label="Previous week"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <p class="body-2 min-w-44 text-center text-brand-gray-900">
          {{ viewMode === "week" ? weekRangeLabel : monthLabel }}
        </p>
        <button
          type="button"
          class="cursor-pointer rounded-full border border-brand-gray-100 p-2 body-3 text-brand-gray-700 transition hover:bg-brand-gray-50"
          @click="goNextWeek"
          aria-label="Next week"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </section>

      <section class="w-full lg:w-auto">
        <SitterCalendarLegend />
      </section>
    </section>

    <article v-if="loading" class="rounded-2xl bg-brand-white p-8 body-3 text-brand-gray-500">
      Loading calendar...
    </article>
    <section class="space-y-3 md:hidden">
      <article
        v-if="!loading && mobileAgendaGroups.length === 0"
        class="rounded-xl border border-brand-gray-100 p-6 text-center body-3 text-brand-gray-500"
      >
        No calendar bookings found
      </article>

      <article
        v-for="group in mobileAgendaGroups"
        :key="`mobile-day-${group.date}`"
        class="rounded-xl border border-brand-gray-100"
      >
        <header class="sticky top-0 z-10 rounded-t-xl border-b border-brand-gray-100 bg-brand-gray-50 px-3 py-2">
          <p class="body-3 text-brand-gray-700">{{ mobileDateLabel(group.date) }}</p>
        </header>
        <section class="space-y-2 p-3">
          <article
            v-for="item in group.items"
            :key="`mobile-cal-${item.bookingId}`"
            class="rounded-lg border border-brand-gray-100 p-2.5"
          >
            <header class="flex items-center justify-between gap-3">
              <p class="body-2 text-brand-gray-900">{{ item.ownerName }}</p>
              <span class="body-3" :class="mobileStatusClass(item.status)">{{ statusLabel(item.status) }}</span>
            </header>
            <p class="body-3 text-brand-gray-600">
              {{ item.startTime }} - {{ item.endTime }}
            </p>
            <button
              type="button"
              class="mt-1.5 cursor-pointer body-3 text-brand-orange-700 transition hover:text-brand-orange-500"
              @click="openBookingDetail(item.bookingId)"
            >
              View Detail
            </button>
          </article>
        </section>
      </article>
    </section>

    <section class="hidden overflow-x-auto md:block">
      <SitterCalendarGrid
        v-if="!loading && viewMode === 'week'"
        :days="weekDays"
        :items="filteredCalendarItems"
        @select-booking="openBookingDetail"
      />
      <SitterCalendarMonthGrid
        v-else-if="!loading"
        :days="monthDays"
        :items="filteredCalendarItems"
        @select-booking="openBookingDetail"
      />
    </section>
  </section>
</template>
