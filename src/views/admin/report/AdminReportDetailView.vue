<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminReportById, updateReportStatus, type Report } from '@/api/admin/reports'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()

// ─── State ────────────────────────────────────────────────────────────────────
const report = ref<Report | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)

const showCancelModal = ref(false)
const showResolveModal = ref(false)

// ─── Fetch (auto-changes NEW_REPORT → PENDING on server) ─────────────────────
onMounted(async () => {
  try {
    report.value = await getAdminReportById(Number(route.params.id))
  } catch {
    router.push('/admin/reports')
  } finally {
    isLoading.value = false
  }
})

// ─── Actions ─────────────────────────────────────────────────────────────────
const handleUpdateStatus = async (status: 'RESOLVED' | 'CANCELLED') => {
  if (!report.value) return
  isSubmitting.value = true
  try {
    report.value = await updateReportStatus(report.value.id, status)
  } finally {
    isSubmitting.value = false
    showCancelModal.value = false
    showResolveModal.value = false
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

const isClosed = (status: string) => status === 'RESOLVED' || status === 'CANCELLED'
</script>

<template>
  <div class="flex flex-col gap-5 h-full">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-32">
      <svg class="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <template v-else-if="report">

      <!-- Header bar -->
      <div class="flex items-center justify-between gap-4">
        <!-- Left: back + title + status -->
        <div class="flex items-center gap-3 min-w-0">
          <button
            @click="router.push('/admin/reports')"
            class="text-gray-500 hover:text-gray-800 transition shrink-0 cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-900 truncate">{{ report.issue }}</h1>
          <span class="inline-flex items-center gap-1.5 text-sm font-medium shrink-0" :class="getStatusStyle(report.status).text">
            <span class="w-2 h-2 rounded-full" :class="getStatusStyle(report.status).dot"></span>
            {{ getStatusStyle(report.status).label }}
          </span>
        </div>

        <!-- Right: action buttons (hidden when closed) -->
        <div v-if="!isClosed(report.status)" class="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            class="rounded-full cursor-pointer"
            :disabled="isSubmitting"
            @click="showCancelModal = true"
          >
            Cancel Report
          </Button>
          <Button
            variant="primary"
            class="rounded-full cursor-pointer"
            :loading="isSubmitting"
            @click="showResolveModal = true"
          >
            Resolve
          </Button>
        </div>
      </div>

      <!-- Detail card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col divide-y divide-gray-100">

        <div class="pb-5">
          <p class="text-sm text-gray-400 mb-1">Reported by</p>
          <p class="text-sm text-gray-800 font-medium">{{ report.reporterName ?? '—' }}</p>
        </div>

        <div class="py-5">
          <p class="text-sm text-gray-400 mb-1">Reported Person</p>
          <p class="text-sm text-gray-800 font-medium">{{ report.reportedSitterName ?? '—' }}</p>
        </div>

        <div class="py-5">
          <p class="text-sm text-gray-400 mb-1">Issue</p>
          <p class="text-sm text-gray-800 font-medium">{{ report.issue }}</p>
        </div>

        <div class="py-5">
          <p class="text-sm text-gray-400 mb-1">Description</p>
          <p class="text-sm text-gray-800 leading-relaxed">{{ report.description ?? '—' }}</p>
        </div>

        <div class="pt-5">
          <p class="text-sm text-gray-400 mb-1">Date Submitted</p>
          <p class="text-sm text-gray-800 font-medium">{{ formatDate(report.createdAt) }}</p>
        </div>

      </div>
    </template>
  </div>

  <!-- ── Cancel confirmation modal ─────────────────────────────────────────── -->
  <div
    v-if="showCancelModal"
    class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-8 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold text-gray-900">Cancel Report</h3>
        <p class="text-sm text-gray-500">
          Are you sure you want to cancel this report? This action cannot be undone.
        </p>
      </div>
      <div class="flex justify-between">
        <Button variant="secondary" class="rounded-full cursor-pointer" :disabled="isSubmitting" @click="showCancelModal = false">
          Back
        </Button>
        <Button variant="primary" class="rounded-full cursor-pointer" :loading="isSubmitting" @click="handleUpdateStatus('CANCELLED')">
          Cancel Report
        </Button>
      </div>
    </div>
  </div>

  <!-- ── Resolve confirmation modal ────────────────────────────────────────── -->
  <div
    v-if="showResolveModal"
    class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-8 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold text-gray-900">Resolve Report</h3>
        <p class="text-sm text-gray-500">
          Confirm that this report has been reviewed and the issue has been resolved.
        </p>
      </div>
      <div class="flex justify-between">
        <Button variant="secondary" class="rounded-full cursor-pointer" :disabled="isSubmitting" @click="showResolveModal = false">
          Back
        </Button>
        <Button variant="primary" class="rounded-full cursor-pointer" :loading="isSubmitting" @click="handleUpdateStatus('RESOLVED')">
          Resolve
        </Button>
      </div>
    </div>
  </div>
</template>
