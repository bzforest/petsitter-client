<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  getSitterProfiles,
  type SitterProfile,
  type SitterStatus,
} from '@/api/admin/sitterProfiles'

// State
const profiles = ref<SitterProfile[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const searchQuery = ref('')
const selectedStatus = ref<SitterStatus | 'ALL'>('ALL')

// Server pagination
const serverPage = ref(0)
const serverTotalPages = ref(1)
const PAGE_SIZE = 20

// Client-side pagination (on filtered results)
const clientPage = ref(1)
const CLIENT_PAGE_SIZE = 8

// Status options
const statusOptions: { value: SitterStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All status' },
  { value: 'WAITING_FOR_APPROVE', label: 'Waiting for approve' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

// Fetch data
async function fetchProfiles(page = 0) {
  isLoading.value = true
  errorMessage.value = null
  try {
    const result = await getSitterProfiles({ page, size: PAGE_SIZE, sortBy: 'id', direction: 'asc' })
    profiles.value = result.content
    serverTotalPages.value = result.totalPages
    serverPage.value = page
    clientPage.value = 1
  } catch {
    errorMessage.value = 'Failed to load sitter profiles. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchProfiles(0))

// Filtering (client-side on fetched page)
const filteredProfiles = computed(() => {
  let list = profiles.value

  if (selectedStatus.value !== 'ALL') {
    list = list.filter((p) => p.status === selectedStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.email.toLowerCase().includes(q) ||
        (p.tradeName ?? '').toLowerCase().includes(q),
    )
  }

  return list
})

// Client-side pagination
const totalClientPages = computed(() =>
  Math.max(1, Math.ceil(filteredProfiles.value.length / CLIENT_PAGE_SIZE)),
)

const pagedProfiles = computed(() => {
  const start = (clientPage.value - 1) * CLIENT_PAGE_SIZE
  return filteredProfiles.value.slice(start, start + CLIENT_PAGE_SIZE)
})

watch([searchQuery, selectedStatus], () => {
  clientPage.value = 1
})

// Pagination helpers
function prevClientPage() {
  if (clientPage.value > 1) clientPage.value--
}
function nextClientPage() {
  if (clientPage.value < totalClientPages.value) clientPage.value++
}
function goToClientPage(p: number) {
  clientPage.value = p
}

function prevServerPage() {
  if (serverPage.value > 0) fetchProfiles(serverPage.value - 1)
}
function nextServerPage() {
  if (serverPage.value < serverTotalPages.value - 1) fetchProfiles(serverPage.value + 1)
}

// Visible page numbers (ellipsis logic)
function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

// Status display
function statusLabel(status: SitterStatus): string {
  switch (status) {
    case 'WAITING_FOR_APPROVE': return 'Waiting for approve'
    case 'APPROVED': return 'Approved'
    case 'REJECTED': return 'Rejected'
  }
}

function statusDotClass(status: SitterStatus): string {
  switch (status) {
    case 'WAITING_FOR_APPROVE': return 'bg-pink-400'
    case 'APPROVED': return 'bg-green-500'
    case 'REJECTED': return 'bg-red-500'
  }
}

function statusTextClass(status: SitterStatus): string {
  switch (status) {
    case 'WAITING_FOR_APPROVE': return 'text-pink-500'
    case 'APPROVED': return 'text-green-600'
    case 'REJECTED': return 'text-red-500'
  }
}

// Avatar helper
function avatarInitial(email: string): string {
  return (email?.[0] ?? '?').toUpperCase()
}

function avatarColor(email: string): string {
  const colors = [
    'bg-orange-400', 'bg-sky-400', 'bg-violet-400',
    'bg-emerald-400', 'bg-rose-400', 'bg-amber-400',
  ]
  const idx = email.charCodeAt(0) % colors.length
  return colors[idx]
}
</script>

<template>
  <div class="flex flex-col gap-5 h-full">

    <!-- Page header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <h1 class="text-2xl font-bold text-gray-900">Pet Sitter</h1>

      <div class="flex items-center gap-3 flex-wrap">
        <!-- Search -->
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
            fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition w-56"
          />
        </div>

        <!-- Status filter -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition cursor-pointer"
          >
            <option
              v-for="opt in statusOptions"
              :key="opt.value"
              :value="opt.value"
            >{{ opt.label }}</option>
          </select>
          <svg
            class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Table card -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

      <!-- Loading -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="text-sm">Loading...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center py-20">
        <div class="text-center">
          <p class="text-red-500 text-sm mb-3">{{ errorMessage }}</p>
          <button
            @click="fetchProfiles(0)"
            class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>

      <template v-else>
        <!-- Table header -->
        <div class="grid grid-cols-[2fr_2fr_3fr_1.5fr] bg-gray-900 text-white text-sm font-medium">
          <div class="px-5 py-3.5">Full Name</div>
          <div class="px-5 py-3.5">Pet Sitter Name</div>
          <div class="px-5 py-3.5">Email</div>
          <div class="px-5 py-3.5">Status</div>
        </div>

        <!-- Empty state -->
        <div
          v-if="pagedProfiles.length === 0"
          class="flex-1 flex items-center justify-center py-16 text-gray-400 text-sm"
        >
          No sitter profiles found.
        </div>

        <!-- Rows -->
        <div v-else class="flex-1 overflow-auto divide-y divide-gray-100">
          <div
            v-for="profile in pagedProfiles"
            :key="profile.id"
            class="grid grid-cols-[2fr_2fr_3fr_1.5fr] items-center hover:bg-gray-50 transition-colors"
          >
            <!-- Full Name (avatar + email) -->
            <div class="px-5 py-3.5 flex items-center gap-3 min-w-0">
              <div
                class="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold"
                :class="avatarColor(profile.email)"
              >
                {{ avatarInitial(profile.email) }}
              </div>
              <span class="text-sm font-medium text-gray-800 truncate">
                {{ profile.email.split('@')[0] }}
              </span>
            </div>

            <!-- Pet Sitter Name (tradeName) -->
            <div class="px-5 py-3.5 min-w-0">
              <span class="text-sm text-gray-700 truncate block">
                {{ profile.tradeName ?? '—' }}
              </span>
            </div>

            <!-- Email -->
            <div class="px-5 py-3.5 min-w-0">
              <span class="text-sm text-gray-600 truncate block">{{ profile.email }}</span>
            </div>

            <!-- Status -->
            <div class="px-5 py-3.5">
              <span class="inline-flex items-center gap-1.5 text-sm font-medium" :class="statusTextClass(profile.status)">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusDotClass(profile.status)" />
                {{ statusLabel(profile.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredProfiles.length > 0"
          class="px-5 py-4 border-t border-gray-100 flex items-center justify-center gap-1.5"
        >
          <!-- Prev -->
          <button
            @click="prevClientPage"
            :disabled="clientPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <!-- Page numbers (client filtered) -->
          <template v-for="p in pageNumbers(clientPage, totalClientPages)" :key="String(p)">
            <span
              v-if="p === '…'"
              class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none"
            >…</span>
            <button
              v-else
              @click="goToClientPage(p as number)"
              class="w-8 h-8 flex items-center justify-center rounded-full text-sm transition font-medium"
              :class="
                clientPage === p
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              "
            >{{ p }}</button>
          </template>

          <!-- Next -->
          <button
            @click="nextClientPage"
            :disabled="clientPage === totalClientPages"
            class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Server page nav (load more from server) -->
        <div
          v-if="serverTotalPages > 1 && selectedStatus === 'ALL' && !searchQuery.trim()"
          class="px-5 pb-4 flex items-center justify-center gap-2 text-xs text-gray-400"
        >
          <span>Server page {{ serverPage + 1 }} / {{ serverTotalPages }}</span>
          <button
            @click="prevServerPage"
            :disabled="serverPage === 0"
            class="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >← Prev batch</button>
          <button
            @click="nextServerPage"
            :disabled="serverPage === serverTotalPages - 1"
            class="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >Next batch →</button>
        </div>
      </template>
    </div>
  </div>
</template>
