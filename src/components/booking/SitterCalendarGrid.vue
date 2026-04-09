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

const startHour = 8;
const endHour = 20;
const rowHeightPx = 56;
const slots = computed(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)); // 8:00 - 20:00

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function timeToMinutes(value: string): number {
  const [hh, mm] = String(value).split(":");
  const h = Number(hh);
  const m = Number(mm || "0");
  return h * 60 + m;
}

function statusClass(status: SitterCalendarItemResponse["status"]): string {
  if (status === "PENDING" || status === "PAID") return "border-brand-pink-300 bg-brand-pink-50 text-brand-pink-500";
  if (status === "CONFIRMED" || status === "IN_SERVICE") return "border-brand-orange-500 bg-orange-50 text-brand-orange-700";
  if (status === "COMPLETED") return "border-brand-green-500 bg-brand-green-50 text-brand-green-500";
  return "border-brand-gray-200 bg-brand-gray-50 text-brand-gray-500";
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}

function dayNumber(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric" });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return dateKey(date) === dateKey(now);
}

function timeLabel(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12} ${suffix}`;
}

const gridHeight = computed(() => slots.value.length * rowHeightPx);

const dayColumns = computed(() => {
  return props.days.map((day) => {
    const key = dateKey(day);
    const dayItems = props.items
      .filter((item) => item.startDate === key)
      .map((item) => {
        const startMins = Math.max(startHour * 60, timeToMinutes(item.startTime));
        const endMins = Math.max(startMins + 30, Math.min((endHour + 1) * 60, timeToMinutes(item.endTime)));
        const top = ((startMins - startHour * 60) / 60) * rowHeightPx;
        const height = ((endMins - startMins) / 60) * rowHeightPx;
        return {
          ...item,
          top,
          height: Math.max(24, height),
        };
      });
    return { key, dayItems };
  });
});
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-brand-gray-100 bg-brand-white">
    <section class="grid grid-cols-[90px_repeat(7,minmax(0,1fr))] border-b border-brand-gray-100 bg-brand-gray-50">
      <article class="px-3 py-3 body-3 text-brand-gray-400">Time</article>
      <article
        v-for="day in days"
        :key="dateKey(day)"
        class="px-3 py-3 text-center"
        :class="isToday(day) ? 'bg-brand-gray-100' : ''"
      >
        <p class="body-3 text-brand-gray-400">{{ dayLabel(day) }}</p>
        <p class="body-2 text-brand-gray-900">{{ dayNumber(day) }}</p>
      </article>
    </section>

    <section class="grid grid-cols-[90px_repeat(7,minmax(0,1fr))]">
      <article class="border-r border-brand-gray-100">
        <section
          v-for="hour in slots"
          :key="`time-${hour}`"
          class="border-b border-brand-gray-100 px-3 py-4 body-3 text-brand-gray-400 last:border-b-0"
          :style="{ height: `${rowHeightPx}px` }"
        >
          {{ timeLabel(hour) }}
        </section>
      </article>

      <article
        v-for="column in dayColumns"
        :key="column.key"
        class="relative border-r border-brand-gray-100 last:border-r-0"
        :class="isToday(new Date(column.key)) ? 'bg-brand-gray-50' : ''"
        :style="{ height: `${gridHeight}px` }"
      >
        <section
          v-for="hour in slots"
          :key="`${column.key}-${hour}`"
          class="border-b border-brand-gray-100 last:border-b-0"
          :style="{ height: `${rowHeightPx}px` }"
        />

        <button
          v-for="item in column.dayItems"
          :key="item.bookingId"
          type="button"
          class="absolute left-1 right-1 flex cursor-pointer items-center justify-center rounded-none border-2 px-2 text-center body-3 transition hover:opacity-85"
          :class="statusClass(item.status)"
          :style="{ top: `${item.top}px`, height: `${item.height}px` }"
          @click="emit('selectBooking', item.bookingId)"
        >
          <p class="w-full truncate text-center">{{ item.ownerName }}</p>
        </button>
      </article>
    </section>
  </section>
</template>
