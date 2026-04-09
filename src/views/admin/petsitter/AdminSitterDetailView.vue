<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChevronLeft, AlertCircle, User } from "lucide-vue-next";
import {
  getSitterProfileById,
  approveSitter,
  rejectSitter,
  type SitterProfile,
} from "@/api/admin/sitterProfiles";
import SitterStatusBadge from "@/components/admin/SitterStatusBadge.vue";
import RejectConfirmPopup from "@/components/ui/RejectConfirmPopup.vue";
import Button from "@/components/ui/Button.vue";
import ReadOnlyMap from "@/components/ map/ReadOnlyMap.vue";

const route = useRoute();
const router = useRouter();

const sitterId = computed(() => Number(route.params.id));
const profile = ref<SitterProfile | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const isSubmitting = ref(false);
const showRejectModal = ref(false);
const activeTab = ref<"profile" | "booking" | "reviews">("profile");

const PENDING_TEXT = "รอ Pet sitter ดำเนินการอัพเดท";

// Data fetching
async function loadProfile() {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    profile.value = await getSitterProfileById(sitterId.value);
  } catch {
    errorMessage.value = "Failed to load sitter profile.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProfile);

// Actions function
async function handleApprove() {
  if (!profile.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    profile.value = await approveSitter(profile.value.id);
  } catch {
    errorMessage.value = "Failed to approve. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}

async function handleReject(reason: string) {
  if (!profile.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    profile.value = await rejectSitter(profile.value.id, reason);
    showRejectModal.value = false;
  } catch {
    errorMessage.value = "Failed to reject. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}

// Helpers function
function parsePetTypes(petTypes: string | null): string[] {
  if (!petTypes) return [];
  return petTypes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const displayName = computed(
  () => profile.value?.fullName ?? profile.value?.email?.split("@")[0] ?? "—",
);

// Derived display values (null = no data → show pending text)
const fullName = computed(() => profile.value?.fullName?.trim() || null);
const isApproved = computed(() => profile.value?.status === "APPROVED");
const experience = computed(() =>
  profile.value?.experience != null
    ? `${profile.value.experience} Year${profile.value.experience !== 1 ? "s" : ""}`
    : null,
);
const phone = computed(() => profile.value?.phone?.trim() || null);
const bio = computed(() => profile.value?.bio?.trim() || null);

// APPROVED section
const tradeName = computed(() => profile.value?.tradeName?.trim() || null);
const petTypesList = computed(() =>
  parsePetTypes(profile.value?.petTypes ?? null),
);
const services = computed(
  () => profile.value?.servicesDescription?.trim() || null,
);
const placeDescription = computed(
  () => profile.value?.placeDescription?.trim() || null,
);
const address = computed(() => {
  const p = profile.value;
  const parts = [
    p?.addressLine,
    p?.subDistrict,
    p?.district,
    p?.province,
    p?.postalCode,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(", ") : null;
});
const hasCoords = computed(
  () => profile.value?.latitude != null && profile.value?.longitude != null,
);
const gallery = computed(() =>
  profile.value?.gallery && profile.value.gallery.length > 0
    ? profile.value.gallery
    : null,
);
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Loading indicator -->
    <div
      v-if="isLoading"
      class="flex-1 flex flex-col items-center justify-center gap-2 py-20 text-gray-400"
    >
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
      <span class="body-2 font-medium text-brand-gray-500"
        >Loading sitter profile...</span
      >
    </div>

    <!-- Fetch error -->
    <div
      v-else-if="!profile"
      class="flex-1 flex items-center justify-center py-20 text-center"
    >
      <div>
        <p class="text-red-500 body-2 mb-3">
          {{ errorMessage ?? "Sitter profile not found." }}
        </p>
        <Button variant="secondary" @click="loadProfile">Retry</Button>
      </div>
    </div>

    <template v-else>
      <!-- Page Header -->
      <div class="flex items-center justify-between gap-4 mb-5">
        <div class="flex items-center gap-2 min-w-0">
          <button
            @click="router.push('/admin/pet-sitters')"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 shrink-0 cursor-pointer hover:text-brand-orange-700"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <h1 class="headline-3 font-bold text-brand-black mr-2">
            {{ displayName }}
          </h1>
          <SitterStatusBadge :status="profile.status" />
        </div>

        <!-- Reject + Approve — เฉพาะ WAITING_FOR_APPROVE -->
        <div
          v-if="profile.status === 'WAITING_FOR_APPROVE'"
          class="flex items-center gap-3 shrink-0"
        >
          <Button
            variant="secondary"
            :disabled="isSubmitting"
            @click="showRejectModal = true"
          >
            Reject
          </Button>
          <Button
            variant="primary"
            :disabled="isSubmitting"
            @click="handleApprove"
          >
            Approve
          </Button>
        </div>
      </div>

      <!-- Action Error Banner -->
      <div
        v-if="errorMessage"
        class="flex items-center gap-2 px-4 py-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-600 body-3"
      >
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ errorMessage }}</span>
        <button
          class="ml-auto text-red-400 hover:text-red-600"
          @click="errorMessage = null"
        >
          ✕
        </button>
      </div>

      <!-- Rejected Banner -->
      <div
        v-if="profile.status === 'REJECTED'"
        class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 body-2 mb-3"
      >
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>
          Their request has not been approved
          <span v-if="profile.rejectReason"
            >: '<em>{{ profile.rejectReason }}</em> '</span
          >
        </span>
      </div>

      <!-- Tabs bar -->
      <div class="flex gap-3">
        <button
          v-for="tab in [
            { id: 'profile', label: 'Profile' },
            { id: 'booking', label: 'Booking' },
            { id: 'reviews', label: 'Reviews' },
          ]"
          :key="tab.id"
          @click="activeTab = tab.id as typeof activeTab"
          class="px-8 py-3 headline-5 font-semibold transition-colors rounded-t-xl"
          :class="
            activeTab === tab.id
              ? 'bg-brand-white text-brand-orange-700'
              : 'bg-brand-gray-100 text-brand-gray-500 hover:text-brand-black'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Main card -->
      <div class="bg-white rounded-r-xl rounded-b-xl flex flex-col">
        <!-- Profile Tab -->
        <div
          v-if="activeTab === 'profile'"
          class="py-10 px-6 flex flex-col gap-6"
        >
          <div class="flex gap-10 flex-wrap">
            <!-- Profile Image -->
            <div class="shrink-0">
              <div
                class="w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ring-1 ring-gray-100"
              >
                <img
                  v-if="profile.profileImage"
                  :src="profile.profileImage"
                  :alt="displayName"
                  class="w-full h-full object-cover"
                />
                <User v-else class="w-20 h-20 text-gray-300" />
              </div>
            </div>

            <!-- Basic Info -->
            <div class="flex-1 bg-brand-gray-50 rounded-lg p-6">
              <div class="grid grid-cols-1 gap-8">
                <!-- Full Name -->
                <div class="flex flex-col gap-1">
                  <p class="headline-4 font-bold text-brand-gray-300">
                    Full Name
                  </p>
                  <p v-if="fullName" class="body-2 text-brand-black">
                    {{ fullName }}
                  </p>
                  <p v-else class="body-2 text-red-500 font-medium">
                    {{ PENDING_TEXT }}
                  </p>
                </div>

                <!-- Experience — แสดงเฉพาะเมื่อ APPROVED -->
                <div v-if="isApproved" class="flex flex-col gap-1">
                  <p class="headline-4 font-bold text-brand-gray-300">
                    Experience
                  </p>
                  <p v-if="experience" class="body-2 text-brand-black">
                    {{ experience }}
                  </p>
                  <p v-else class="body-2 text-red-500 font-medium">
                    {{ PENDING_TEXT }}
                  </p>
                </div>

                <!-- Phone -->
                <div class="flex flex-col gap-1">
                  <p class="headline-4 font-bold text-brand-gray-300">Phone</p>
                  <p v-if="phone" class="body-2 text-brand-black">
                    {{ phone }}
                  </p>
                  <p v-else class="body-2 text-red-500 font-medium">
                    {{ PENDING_TEXT }}
                  </p>
                </div>

                <!-- Introduction -->
                <div class="flex flex-col gap-1">
                  <p class="headline-4 font-bold text-brand-gray-300">
                    Introduction
                  </p>
                  <p v-if="bio" class="body-2 text-brand-black leading-relaxed">
                    {{ bio }}
                  </p>
                  <p v-else class="body-2 text-red-500 font-medium">
                    {{ PENDING_TEXT }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- APPROVED-only section -->
          <template v-if="profile.status === 'APPROVED'">
            <div
              class="w-full bg-brand-gray-50 rounded-lg p-6 flex flex-col gap-8"
            >
              <!-- Pet Sitter Name (Trade Name) -->
              <div class="flex flex-col gap-1">
                <p class="headline-4 font-bold text-brand-gray-300">
                  Pet Sitter Name
                </p>
                <p v-if="tradeName" class="body-2 text-brand-black">
                  {{ tradeName }}
                </p>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>

              <!-- Pet Types -->
              <div class="flex flex-col gap-2">
                <p class="headline-4 font-bold text-brand-gray-300">Pet Type</p>
                <div
                  v-if="petTypesList.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="type in petTypesList"
                    :key="type"
                    class="px-3 py-1 rounded-full body-3 font-medium bg-brand-orange-50 text-brand-orange-700 border border-brand-orange-200"
                  >
                    {{ type }}
                  </span>
                </div>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>

              <!-- Services -->
              <div class="flex flex-col gap-1">
                <p class="headline-4 font-bold text-brand-gray-300">Services</p>
                <p
                  v-if="services"
                  class="body-2 text-brand-black leading-relaxed whitespace-pre-line"
                >
                  {{ services }}
                </p>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>

              <!-- My Place -->
              <div class="flex flex-col gap-1">
                <p class="headline-4 font-bold text-brand-gray-300">My Place</p>
                <p
                  v-if="placeDescription"
                  class="body-2 text-brand-black leading-relaxed"
                >
                  {{ placeDescription }}
                </p>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>

              <!-- Image Gallery -->
              <div class="flex flex-col gap-3">
                <p class="headline-4 font-bold text-brand-gray-300">
                  Image Gallery
                </p>
                <div v-if="gallery" class="grid grid-cols-4 gap-3">
                  <div
                    v-for="(img, i) in gallery"
                    :key="i"
                    class="aspect-square overflow-hidden bg-gray-100"
                  >
                    <img
                      :src="img"
                      :alt="`Gallery ${i + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>
            </div>

            <!-- Address -->
            <div
              class="w-full bg-brand-gray-50 rounded-lg p-6 flex flex-col gap-4"
            >
              <div class="flex flex-col gap-1">
                <p class="headline-4 font-bold text-brand-gray-300">Address</p>
                <p v-if="address" class="body-2 text-brand-black">
                  {{ address }}
                </p>
                <p v-else class="body-2 text-red-500 font-medium">
                  {{ PENDING_TEXT }}
                </p>
              </div>

              <!-- Map — แสดงเมื่อมี lat/lng -->
              <ReadOnlyMap
                v-if="hasCoords"
                :lat="profile.latitude!"
                :lng="profile.longitude!"
              />
              <p v-else class="body-3 text-brand-gray-400 italic">
                No location pin set yet.
              </p>
            </div>
          </template>
        </div>

        <!-- Booking Tab (placeholder) -->
        <div
          v-else-if="activeTab === 'booking'"
          class="flex-1 flex items-center justify-center py-24 text-brand-gray-400 body-3"
        >
          Booking data coming soon.
        </div>

        <!-- Reviews Tab (placeholder) -->
        <div
          v-else
          class="flex-1 flex items-center justify-center py-24 text-brand-gray-400 body-3"
        >
          Reviews data coming soon.
        </div>
      </div>
    </template>

    <!-- Reject Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showRejectModal"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="showRejectModal = false"
        >
          <RejectConfirmPopup
            message="Are you sure you want to reject this sitter's request? Please provide a reason below."
            @confirm="handleReject"
            @cancel="showRejectModal = false"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
