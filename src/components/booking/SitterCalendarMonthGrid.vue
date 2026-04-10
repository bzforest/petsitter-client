<script setup lang="ts">
import { computed } from "vue";
import type { SitterCalendarItemResponse } from "@/services/sitterCalendar.service";

const props = defineProps<{
  days: Date[];
  items: SitterCalendarItemResponse[];
}>();

const emit = defineEmits<{
  selectBooking: [bookingId: number];
}>();

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}

function isToday(date: Date): boolean {
  return dateKey(date) === dateKey(new Date());
}

function statusDotClass(status: SitterCalendarItemResponse["status"]): string {
  if (status === "PENDING" || status === "PAID") return "bg-brand-pink-400";
  if (status === "CONFIRMED" || status === "IN_SERVICE") return "bg-brand-orange-500";
  if (status === "COMPLETED") return "bg-brand-green-500";
  return "bg-brand-gray-300";
}

const dayItemMap = computed(() => {
  const map = new Map<string, SitterCalendarItemResponse[]>();
  for (const day of props.days) {
    const key = dateKey(day);
    const list = props.items
      .filter((item) => item.startDate === key)
      .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
    map.set(key, list);
  }
  return map;
});
</script>

<template>
  <section class="min-w-[760px] overflow-hidden rounded-2xl border border-brand-gray-100 bg-brand-white">
    <section class="grid grid-cols-7 border-b border-brand-gray-100 bg-brand-gray-50">
      <article
        v-for="day in days.slice(0, 7)"
        :key="`head-${dateKey(day)}`"
        class="px-3 py-2 text-center"
      >
        <p class="body-3 text-brand-gray-400">{{ weekdayLabel(day) }}</p>
      </article>
    </section>

    <section class="grid grid-cols-7">
      <article
        v-for="day in days"
        :key="dateKey(day)"
        class="min-h-28 border-r border-b border-brand-gray-100 p-2 last:border-r-0"
        :class="isToday(day) ? 'bg-brand-gray-50' : ''"
      >
        <header class="mb-1 flex items-center justify-between">
          <p class="body-3" :class="isToday(day) ? 'text-brand-orange-700' : 'text-brand-gray-700'">
            {{ day.getDate() }}
          </p>
        </header>

        <section class="space-y-1">
          <button
            v-for="item in (dayItemMap.get(dateKey(day)) || []).slice(0, 3)"
            :key="item.bookingId"
            type="button"
            class="flex w-full cursor-pointer items-center gap-1.5 rounded-none px-1.5 py-1 text-left transition hover:bg-brand-gray-50"
            @click="emit('selectBooking', item.bookingId)"
          >
            <span class="h-2 w-2 rounded-full" :class="statusDotClass(item.status)" aria-hidden="true"></span>
            <span class="truncate body-3 text-brand-gray-700">{{ item.ownerName }}</span>
          </button>
          <p
            v-if="(dayItemMap.get(dateKey(day)) || []).length > 3"
            class="body-3 px-1.5 text-brand-gray-400"
          >
            +{{ (dayItemMap.get(dateKey(day)) || []).length - 3 }} more
          </p>
        </section>
      </article>
    </section>
  </section>
</template>
