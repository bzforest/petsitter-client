<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  getSitterProfiles,
  type SitterProfile,
  type SitterStatus,
} from "@/api/admin/sitterProfiles";
import PaginationField from "@/components/ui/PaginationField.vue";
import SitterSearchBar from "@/components/admin/SitterSearchBar.vue";
import SitterTableRow from "@/components/admin/SitterTableRow.vue";

// ─── State ───────────────────────────────────────────────────────────────────
const profiles = ref<SitterProfile[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const searchQuery = ref("");
const selectedStatus = ref<SitterStatus | "ALL">("ALL");

const currentPage = ref(1);
const totalPages = ref(1);
const PAGE_SIZE = 10;

const statusOptions: { value: SitterStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All status" },
  { value: "WAITING_FOR_APPROVE", label: "Waiting for approve" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchProfiles(page = 1) {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const result = await getSitterProfiles({
      page: page - 1, // server is 0-indexed
      size: PAGE_SIZE,
      sortBy: "id",
      direction: "desc",
      query: searchQuery.value.trim() || undefined,
      status:
        selectedStatus.value !== "ALL" ? selectedStatus.value : undefined,
    });
    profiles.value = result.content;
    totalPages.value = Math.max(1, result.totalPages);
    currentPage.value = page;
  } catch {
    errorMessage.value = "Failed to load sitter profiles. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchProfiles(1));

// ─── Watchers ────────────────────────────────────────────────────────────────
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchProfiles(1), 400);
});

watch(selectedStatus, () => {
  fetchProfiles(1);
});
</script>

<template>
  <div class="flex flex-col gap-5 h-full">
    <!-- Page header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <h1 class="text-2xl font-bold text-gray-900">Pet Sitter</h1>
      <SitterSearchBar
        v-model:search-query="searchQuery"
        v-model:selected-status="selectedStatus"
        :status-options="statusOptions"
      />
    </div>

    <!-- Table card -->
    <div
      class="bg-white rounded-2xl shadow-sm mt-5 border border-gray-100 overflow-hidden flex flex-col"
    >
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="flex-1 flex items-center justify-center py-20"
      >
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span class="text-sm">Loading sitter data...</span>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="flex-1 flex items-center justify-center py-20"
      >
        <div class="text-center">
          <p class="text-red-500 text-sm mb-3">{{ errorMessage }}</p>
          <button
            @click="fetchProfiles(currentPage)"
            class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>

      <template v-else>
        <!-- Table header -->
        <div
          class="grid grid-cols-[2fr_2fr_3fr_1.5fr] bg-brand-black text-white body-3 font-medium"
        >
          <div class="px-5 py-3.5">Full Name</div>
          <div class="px-5 py-3.5">Pet Sitter Name</div>
          <div class="px-5 py-3.5">Email</div>
          <div class="px-5 py-3.5">Status</div>
        </div>

        <!-- Empty state -->
        <div
          v-if="profiles.length === 0"
          class="flex-1 flex items-center justify-center py-16 text-brand-gray-500 body-3"
        >
          No sitter profiles found.
        </div>

        <!-- Table rows -->
        <div v-else class="overflow-auto divide-y divide-brand-gray-100">
          <SitterTableRow
            v-for="profile in profiles"
            :key="profile.id"
            :profile="profile"
          />
        </div>

        <!-- Pagination (inside card, only when more than one page) -->
        <div
          v-if="totalPages > 1"
          class="px-5 py-4 border-t border-gray-100 flex items-center justify-center"
        >
          <PaginationField
            :total-pages="totalPages"
            :current-page="currentPage"
            @update:current-page="fetchProfiles"
          />
        </div>
      </template>
    </div>
  </div>
</template>
