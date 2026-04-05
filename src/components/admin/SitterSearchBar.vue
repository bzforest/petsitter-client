<script setup lang="ts">
import type { SitterStatus } from "@/api/admin/sitterProfiles";

defineProps<{
  searchQuery: string;
  selectedStatus: SitterStatus | "ALL";
  statusOptions: { value: SitterStatus | "ALL"; label: string }[];
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:selectedStatus", value: SitterStatus | "ALL"): void;
}>();
</script>

<template>
  <div class="flex items-center gap-3 flex-wrap">
    <!-- Search input -->
    <div class="relative">
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 w-4 h-4 pointer-events-none"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        :value="searchQuery"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
        type="text"
        placeholder="Search..."
        class="pl-4 pr-9 py-2 body-3 border border-brand-gray-100 rounded-lg bg-brand-white text-brand-gray-500 placeholder:text-brand-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange-700/30 focus:border-brand-orange-700 transition w-56"
      />
    </div>

    <!-- Status filter -->
    <div class="relative">
      <select
        :value="selectedStatus"
        @change="
          emit(
            'update:selectedStatus',
            ($event.target as HTMLSelectElement).value as SitterStatus | 'ALL',
          )
        "
        class="appearance-none pl-3 pr-8 py-2 body-3 border border-brand-gray-100 rounded-lg bg-brand-white text-brand-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange-700/30 focus:border-brand-orange-700 transition cursor-pointer"
      >
        <option
          v-for="opt in statusOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <svg
        class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
</template>
