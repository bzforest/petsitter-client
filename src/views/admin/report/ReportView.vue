<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAdminReports, type Report, type ReportStatus } from '@/api/admin/reports'
import PaginationField from '@/components/ui/PaginationField.vue'

const router = useRouter()

// ─── State ────────────────────────────────────────────────────────────────────
const reports = ref<Report[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const selectedStatus = ref<ReportStatus | 'ALL'>('ALL')
const currentPage = ref(1)
const totalPages = ref(1)
const PAGE_SIZE = 10

const statusOptions: { value: ReportStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All status' },
  { value: 'NEW_REPORT', label: 'New Report' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchReports(page = 1) {
  isLoading.value = true
  errorMessage.value = null
  try {
    const result = await getAdminReports({
      page: page - 1,
      size: PAGE_SIZE,
      status: selectedStatus.value !== 'ALL' ? selectedStatus.value : undefined,
    })
    reports.value = result.content
    totalPages.value = Math.max(1, result.totalPages)
    currentPage.value = page
  } catch {
    errorMessage.value = 'Failed to load reports. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchReports(1))

watch(selectedStatus, () => fetchReports(1))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const statusStyle: Record<string, { dot: string; text: string; label: string }> = {
  NEW_REPORT: { dot: 'bg-pink-400',   text: 'text-pink-500',  label: 'New Report' },
  PENDING:    { dot: 'bg-teal-400',   text: 'text-teal-500',  label: 'Pending'    },
  RESOLVED:   { dot: 'bg-green-500',  text: 'text-green-600', label: 'Resolved'   },
  CANCELLED:  { dot: 'bg-red-500',    text: 'text-red-600',   label: 'Canceled'   },
}

const getStatusStyle = (status: string) =>
  statusStyle[status] ?? { dot: 'bg-gray-400', text: 'text-gray-500', label: status }
</script>

<template>
  <div class="flex flex-col gap-5 h-full">

    <!-- Page header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <h1 class="text-2xl font-bold text-gray-900">Report</h1>

      <!-- Status filter -->
      <select
        v-model="selectedStatus"
        class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-brand-orange-700 cursor-pointer"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="text-sm">Loading reports...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="flex items-center justify-center py-20">
        <div class="text-center">
          <p class="text-red-500 text-sm mb-3">{{ errorMessage }}</p>
          <button
            @click="fetchReports(currentPage)"
            class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>

      <template v-else>
        <!-- Table header -->
        <div class="grid grid-cols-[2fr_2fr_3fr_2fr_1.5fr] bg-brand-black text-white text-sm font-medium">
          <div class="px-5 py-3.5">User</div>
          <div class="px-5 py-3.5">Reported Person</div>
          <div class="px-5 py-3.5">Issue</div>
          <div class="px-5 py-3.5">Date Submitted</div>
          <div class="px-5 py-3.5">Status</div>
        </div>

        <!-- Empty -->
        <div v-if="reports.length === 0" class="flex items-center justify-center py-16 text-gray-400 text-sm">
          No reports found.
        </div>

        <!-- Rows -->
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="report in reports"
            :key="report.id"
            class="grid grid-cols-[2fr_2fr_3fr_2fr_1.5fr] items-center hover:bg-gray-50 cursor-pointer transition"
            @click="router.push(`/admin/reports/${report.id}`)"
          >
            <div class="px-5 py-4 text-sm text-gray-800 truncate">{{ report.reporterName ?? '—' }}</div>
            <div class="px-5 py-4 text-sm text-gray-800 truncate">{{ report.reportedSitterName ?? '—' }}</div>
            <div class="px-5 py-4 text-sm text-gray-800 truncate">{{ report.issue }}</div>
            <div class="px-5 py-4 text-sm text-gray-500">{{ formatDate(report.createdAt) }}</div>
            <div class="px-5 py-4">
              <span class="inline-flex items-center gap-1.5 text-sm font-medium" :class="getStatusStyle(report.status).text">
                <span class="w-2 h-2 rounded-full shrink-0" :class="getStatusStyle(report.status).dot"></span>
                {{ getStatusStyle(report.status).label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-5 py-4 border-t border-gray-100 flex justify-center">
          <PaginationField :total-pages="totalPages" :current-page="currentPage" @update:current-page="fetchReports" />
        </div>
      </template>
    </div>
  </div>
</template>
