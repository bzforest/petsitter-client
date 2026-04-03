<template>
  <div class="max-w-[1000px] mx-auto p-6 space-y-6">

    <!-- HEADER -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="headline-4 text-brand-gray-900">Pet Sitter Profile</h1>

        <span v-if="status === 'approved'" class="body-3 text-brand-green-500 font-medium">
          • Approved
        </span>
        <span v-else-if="status === 'pending'" class="body-3 text-brand-pink-500 font-medium">
          • Waiting for approve
        </span>
        <span v-else-if="status === 'rejected'" class="body-3 text-brand-red-500 font-medium">
          • Rejected
        </span>
      </div>

      <!-- approved → Update (บันทึกข้อมูล) -->
      <Button
        v-if="status === 'approved'"
        @click="handleSave"
        :disabled="loading"
        :class="!loading ? 'cursor-pointer' : undefined"
      >
        {{ loading ? "Saving..." : "Update" }}
      </Button>

      <!-- pending / rejected → Request for approval -->
      <Button
        v-else
        @click="handleRequestApproval"
        :disabled="requesting"
        :class="!requesting ? 'cursor-pointer' : undefined"
      >
        {{ requesting ? "Sending..." : "Request for approval" }}
      </Button>
    </header>

    <!-- REJECTED ALERT BANNER -->
    <aside
      v-if="status === 'rejected'"
      role="alert"
      class="flex items-center gap-3 rounded-xl bg-[#DCDFED] px-4 py-3 body-3 font-medium text-brand-red-500"
    >
      <AlertCircle class="w-5 h-5 shrink-0 text-brand-red-500" aria-hidden="true" />
      <p class="m-0 text-brand-red-500">
        Your request has not been approved<span v-if="rejectionMessage">: "{{ rejectionMessage }}"</span>
      </p>
    </aside>

    <!-- BASIC INFORMATION -->
    <section class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6">
      <h2 class="body-1 font-bold text-brand-gray-900">Basic Information</h2>

      <div class="space-y-2">
        <p class="body-3 text-brand-gray-500">Profile Image</p>
        <ImageUploadSitter
          :key="form.profileImage || 'profile-photo'"
          variant="circle"
          :preview-from-url="form.profileImage || null"
          @change="handleImageUpload"
        />
      </div>

      <div
        class="grid gap-4"
        :class="status === 'approved' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
      >
        <div>
          <InputField label="Your full name*" v-model="form.fullName" />
          <p v-if="errors.fullName" class="text-brand-red-500 body-3 mt-1">
            {{ errors.fullName }}
          </p>
        </div>
        <div v-if="status === 'approved'">
          <InputField
            label="Experience (years)*"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="e.g. 3"
            :model-value="experienceDisplay"
            @update:model-value="onExperienceNumber"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <InputField
            label="Phone Number*"
            :model-value="form.phone"
            maxlength="10"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="0812345678"
            @update:model-value="onPhoneDigits"
          />
          <p v-if="errors.phone" class="text-brand-red-500 body-3 mt-1">
            {{ errors.phone }}
          </p>
        </div>
        <div>
          <InputField
            label="Email*"
            :model-value="form.email"
            autocomplete="email"
            @update:model-value="onEmailInput"
          />
          <p v-if="errors.email" class="text-brand-red-500 body-3 mt-1">
            {{ errors.email }}
          </p>
        </div>
      </div>

      <TextareaField
        label="Introduction"
        placeholder="Describe about yourself as pet sitter"
        v-model="form.intro"
      />
    </section>

    <!-- Pet Sitter details — หลังแอดมิน Approve เท่านั้น -->
    <section
      v-if="status === 'approved'"
      class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6"
    >
      <h2 class="body-1 font-bold text-brand-gray-900">Pet Sitter</h2>

      <InputField label="Pet sitter name (Trade name)*" v-model="form.tradeName" />

      <MultiSelectField
        label="Pet type"
        placeholder="Select pet types"
        :options="petTypeOptions"
        v-model="petTypesSelected"
      />

      <TextareaField
        label="Services (Describe all of your service for pet sitting)"
        v-model="form.services"
      />
      <TextareaField label="My Place (Describe your place)" v-model="form.place" />

      <div class="space-y-2">
        <p class="body-3 text-brand-gray-500">Image Gallery (maximum 10 images)</p>
        <div class="flex gap-4 flex-wrap">
          <article
            v-for="(url, idx) in form.gallery"
            :key="url + idx"
            class="relative w-44 h-44 shrink-0"
          >
            <img
              :src="url"
              :alt="'Gallery image ' + (idx + 1)"
              class="w-full h-full object-cover rounded-2xl"
            />
            <button
              type="button"
              class="absolute -top-2 -right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-brand-gray-500 text-sm text-white transition hover:bg-brand-gray-700"
              @click="removeGalleryImage(idx)"
            >
              ✕
            </button>
          </article>
          <label
            v-if="form.gallery.length < 10"
            class="w-44 h-44 flex flex-col items-center justify-center gap-5 bg-brand-orange-50 rounded-2xl cursor-pointer hover:bg-brand-orange-100 transition shrink-0"
          >
            <div
              class="w-10 h-10 rounded-full border-5 border-brand-orange-700 flex items-center justify-center text-brand-orange-700 text-4xl font-bold"
            >
              +
            </div>
            <span class="body-2 text-brand-orange-700 font-bold">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleGalleryUpload"
            />
          </label>
        </div>
      </div>
    </section>

    <!-- ADDRESS + map — Figma: แสดงเมื่อ Approved เท่านั้น -->
    <section
      v-if="status === 'approved'"
      class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6"
    >
      <h2 class="body-1 font-bold text-brand-gray-900">Address</h2>

      <div class="relative">
        <InputField
          label="Search Location"
          placeholder="Search location..."
          v-model="searchQuery"
          @update:modelValue="scheduleLocationSearch"
        />
        <div
          v-if="suggestions.length"
          class="absolute z-10 w-full mt-1 border border-brand-gray-100 rounded-xl bg-brand-white shadow-lg overflow-hidden"
        >
          <div
            v-for="item in suggestions"
            :key="item.place_id"
            @click="selectLocation(item)"
            class="px-4 py-3 body-3 text-brand-gray-700 hover:bg-brand-orange-50 cursor-pointer"
          >
            {{ item.display_name }}
          </div>
        </div>
      </div>

      <InputField label="Address Detail" v-model="form.address" />

      <div class="grid grid-cols-2 gap-4">
        <InputField label="District" v-model="form.district" />
        <InputField label="Sub-district" v-model="form.subDistrict" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <InputField label="Province" v-model="form.province" />
        <InputField label="Post Code" v-model="form.postCode" />
      </div>

      <div id="map" class="h-[300px] rounded-xl overflow-hidden"></div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { getProfile, updateProfile, requestApproval } from "../services/sitter.service";
import { uploadImage } from "@/services/supabase.service";
import { useToast } from "@/composables/useToast";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { AlertCircle } from "lucide-vue-next";
import InputField from "@/components/ui/InputField.vue";
import TextareaField from "@/components/ui/TextareaField.vue";
import ImageUploadSitter from "@/components/profile/ImageUploadSitter.vue";
import MultiSelectField from "@/components/ui/MultiSelectField.vue";
import Button from "@/components/ui/Button.vue";
import pinSelectedImg from "@/assets/Pin Selection/Property 1=Selected.png";

const { showToast } = useToast();

const profile = ref<any>(null);

const status = ref<"approved" | "pending" | "rejected">("pending");
const rejectionMessage = ref("");

const statusMap: Record<string, "approved" | "pending" | "rejected"> = {
  APPROVED: "approved",
  WAITING_FOR_APPROVE: "pending",
  REJECTED: "rejected",
};

const petTypeOptions = [
  { label: "Dog", value: "Dog" },
  { label: "Cat", value: "Cat" },
  { label: "Rabbit", value: "Rabbit" },
];

const form = ref({
  fullName: "",
  experience: null as number | null,
  phone: "",
  email: "",
  intro: "",
  tradeName: "",
  petTypes: "",
  services: "",
  place: "",
  address: "",
  district: "",
  subDistrict: "",
  province: "",
  postCode: "",
  profileImage: "",
  gallery: [] as string[],
  latitude: null as number | null,
  longitude: null as number | null,
});

const petTypesSelected = computed({
  get(): (string | number)[] {
    const s = form.value.petTypes;
    if (!s?.trim()) return [];
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  },
  set(v: (string | number)[]) {
    form.value.petTypes = (v as string[]).join(", ");
  },
});

const errors = ref({
  fullName: "",
  email: "",
  phone: "",
});

const MSG_PHONE_10_DIGITS = "Phone number must be exactly 10 digits.";
const MSG_EMAIL_INVALID =
  "Enter a valid email address. It must include @ and a domain (e.g. name@example.com).";

/** Backend บางเคสส่งแค่ `fields` (เช่น @Valid) ไม่มี `message` — ดึงข้อความให้ครบ */
function extractAxiosErrorMessage(err: unknown): string {
  const e = err as { response?: { status?: number; data?: unknown } };
  const status = e?.response?.status;
  const d = e?.response?.data;

  if (!e?.response) {
    return "Cannot reach server. Check your connection and that the API is running.";
  }
  if (status === 401) {
    return "Session expired or not logged in. Please log in again.";
  }
  if (status === 403) {
    return "Access denied (403). Often caused by CORS (e.g. PATCH not allowed) or wrong account role — restart the API and ensure you use a sitter login.";
  }

  if (typeof d === "string" && d.trim()) return d;

  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;

    const fields = o.fields;
    if (fields && typeof fields === "object" && !Array.isArray(fields)) {
      const parts = Object.entries(fields as Record<string, string>).map(
        ([k, v]) => `${k}: ${v}`
      );
      if (parts.length) return parts.join("; ");
    }

    if (typeof o.error === "string" && o.error.trim()) return o.error;
  }

  return "Failed to send request, please try again";
}

function isValidEmailFormat(value: string): boolean {
  const t = value.trim();
  if (!t.includes("@")) return false;
  const at = t.indexOf("@");
  if (at <= 0) return false;
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  if (!local.length || !domain.length) return false;
  return domain.includes(".");
}

const onPhoneDigits = (value: string) => {
  form.value.phone = value.replace(/\D/g, "").slice(0, 10);
  if (errors.value.phone) errors.value.phone = "";
};

const onEmailInput = (value: string) => {
  form.value.email = value;
  if (errors.value.email) errors.value.email = "";
};

const loading = ref(false);
const requesting = ref(false);
const sitterId = ref<number | null>(null);

let map: any;
let marker: any;

// 🔥 ADD ONLY (search state)
const searchQuery = ref("");
const suggestions = ref<any[]>([]);

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/** คิวเรียก Nominatim แบบเรียงกัน + เว้นอย่างน้อย ~1.1s ต่อคำขอ (ลด 429) */
let nominatimQueueTail: Promise<unknown> = Promise.resolve();
let nominatimNextSlotMs = 0;

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nominatimFetch(input: string, init?: RequestInit): Promise<Response> {
  const run = nominatimQueueTail.then(async () => {
    const wait = Math.max(0, nominatimNextSlotMs - Date.now());
    if (wait > 0) await sleepMs(wait);
    const res = await fetch(input, init);
    if (res.status === 429) {
      const ra = res.headers.get("Retry-After");
      const sec = ra ? parseInt(ra, 10) : NaN;
      const backoffMs =
        Number.isFinite(sec) && sec > 0 ? sec * 1000 : 10_000;
      nominatimNextSlotMs = Date.now() + backoffMs;
    } else {
      nominatimNextSlotMs = Date.now() + 1100;
    }
    return res;
  });
  nominatimQueueTail = run.then(
    () => undefined,
    () => undefined
  );
  return run as Promise<Response>;
}

let reverseGeoDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let reverseGeoPending: { lat: number; lng: number; showSuccessToast: boolean } | null =
  null;

const NOMINATIM_429_MSG =
  "เรียกบริการแผนที่ถี่เกินไป รอสักครู่แล้วลองใหม่ (จำกัดประมาณ 1 ครั้งต่อวินาที)";

function scheduleLocationSearch(value?: string) {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    searchDebounceTimer = null;
    fetchLocationSuggestions(value);
  }, 700);
}

const experienceDisplay = computed(() =>
  form.value.experience === null || form.value.experience === undefined
    ? ""
    : String(form.value.experience)
);

function parseExperienceFromApi(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && !Number.isNaN(value)) return Math.trunc(value);
  if (typeof value === "string") {
    const n = parseInt(value.trim(), 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

const onExperienceNumber = (value: string) => {
  const t = value.trim();
  if (t === "") {
    form.value.experience = null;
    return;
  }
  const n = parseInt(t, 10);
  form.value.experience = Number.isNaN(n) ? null : n;
};

onMounted(async () => {
  try {
    const res = await getProfile();
    const data = res.data;

    profile.value = data;
    sitterId.value = data.id;

    form.value.fullName = data.fullName || "";
    form.value.experience = parseExperienceFromApi(data.experience);
    form.value.phone = String(data.phone ?? "").replace(/\D/g, "").slice(0, 10);
    form.value.email = data.email || "";
    form.value.intro = data.bio || "";
    form.value.tradeName = data.tradeName || "";
    form.value.petTypes = data.petTypes || "";
    form.value.services = data.services || "";
    form.value.place = data.placeDescription || "";
    form.value.address = data.addressLine || "";
    form.value.district = data.district || "";
    form.value.subDistrict = data.subDistrict || "";
    form.value.province = data.province || "";
    form.value.postCode = data.postalCode || "";
    form.value.profileImage = data.profileImage || "";
    form.value.gallery = data.gallery || [];
    form.value.latitude = data.latitude || null;
    form.value.longitude = data.longitude || null;

    status.value = statusMap[data.status] || "pending";
    rejectionMessage.value = data.rejectReason || "";

    await nextTick();
    if (status.value === "approved") {
      setTimeout(initMap, 0);
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to load profile, please refresh", "error");
  }
});

watch(status, async (s) => {
  if (s === "approved") {
    await nextTick();
    setTimeout(initMap, 0);
  }
});

onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
  if (reverseGeoDebounceTimer) {
    clearTimeout(reverseGeoDebounceTimer);
    reverseGeoDebounceTimer = null;
  }
  reverseGeoPending = null;
});

function createPinIcon() {
  return L.divIcon({
    className: "sitter-map-pin-marker",
    html: `<img src="${pinSelectedImg}" class="sitter-map-pin-img" alt="Pin marker" />`,
    iconSize: [56, 56],
    iconAnchor: [28, 56],
  });
}

function attachMarkerDragHandler(m: any) {
  m.on("dragend", (e: any) => {
    const pos = e.target.getLatLng();
    form.value.latitude = pos.lat;
    form.value.longitude = pos.lng;
    reverseGeocode(pos.lat, pos.lng, false);
  });
}

function placeMarkerAt(lat: number, lng: number) {
  if (!map) return;
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng], { draggable: true, icon: createPinIcon() }).addTo(map);
  form.value.latitude = lat;
  form.value.longitude = lng;
  attachMarkerDragHandler(marker);
}

const initMap = () => {
  const el = document.getElementById("map");
  if (!el) return;

  if (map) {
    map.remove();
    map = null;
    marker = null;
  }

  map = L.map(el).setView([13.7563, 100.5018], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  if (form.value.latitude != null && form.value.longitude != null) {
    placeMarkerAt(form.value.latitude, form.value.longitude);
  }

  map.on("click", (e: any) => {
    const { lat, lng } = e.latlng;
    placeMarkerAt(lat, lng);
    reverseGeocode(lat, lng, true);
  });
};

function stripThaiAdminPrefix(value: string, pattern: RegExp): string {
  return value.trim().replace(pattern, "").trim();
}

/**
 * แมป Nominatim → ฟอร์ม: กรุงเทพฯ ใช้ city_district=เขต, suburb / quarter / neighbourhood=แขวง,
 * จังหวัดจาก city หรือ state เมื่อระบุกรุงเทพ ไม่เช่นนั้นใช้ค่าคงที่ กรุงเทพมหานคร
 * จังหวัดอื่นมักมี province / county / municipality
 */
function applyNominatimToAddressForm(data: {
  display_name?: string;
  address?: Record<string, unknown>;
}) {
  const displayName = data.display_name || "";
  const a = data.address || {};
  const countryCode = String(a.country_code || "").toLowerCase();

  form.value.address = displayName;

  if (countryCode === "th") {
    const city = String(a.city || "");
    const state = String(a.state || "");
    const bangkokRe = /กรุงเทพ|bangkok/i;
    const isBangkok =
      bangkokRe.test(city) ||
      bangkokRe.test(state) ||
      displayName.includes("กรุงเทพมหานคร");

    if (isBangkok) {
      let province = "";
      if (bangkokRe.test(city)) province = city.trim();
      else if (bangkokRe.test(state)) province = state.trim();
      else province = "กรุงเทพมหานคร";

      let district = stripThaiAdminPrefix(String(a.city_district || ""), /^เขต\s*/);
      if (!district) {
        const suburbForKhet = String(a.suburb || "").trim();
        if (/^เขต/.test(suburbForKhet)) {
          district = stripThaiAdminPrefix(suburbForKhet, /^เขต\s*/);
        }
      }
      if (!district) {
        const m = displayName.match(/เขต([^,，]+)/);
        if (m) district = m[1].trim();
      }

      const suburbRaw = String(a.suburb || "").trim();
      const suburbIsKhet = /^เขต/.test(suburbRaw);
      let subDistrict = "";
      if (suburbRaw && !suburbIsKhet) {
        subDistrict = stripThaiAdminPrefix(suburbRaw, /^แขวง\s*/);
      }
      if (!subDistrict) {
        const fallbackSub = String(a.quarter || a.neighbourhood || "").trim();
        subDistrict = stripThaiAdminPrefix(fallbackSub, /^แขวง\s*/);
      }
      if (!subDistrict) {
        const m = displayName.match(/แขวง([^,，]+)/);
        if (m) subDistrict = m[1].trim();
      }

      form.value.province = province;
      form.value.district = district;
      form.value.subDistrict = subDistrict;
      form.value.postCode = String(a.postcode || "");
      return;
    }

    const provinceRaw = String(a.province || a.state || "").trim();
    const districtRaw = String(
      a.county || a.city_district || a.district || a.city || ""
    ).trim();
    const subRaw = String(
      a.municipality || a.suburb || a.quarter || a.village || ""
    ).trim();

    form.value.province = stripThaiAdminPrefix(provinceRaw, /^จังหวัด\s*/);
    form.value.district = stripThaiAdminPrefix(districtRaw, /^อำเภอ\s*|^เขต\s*/);
    form.value.subDistrict = stripThaiAdminPrefix(subRaw, /^แขวง\s*|^ตำบล\s*/);
    form.value.postCode = String(a.postcode || "");
    return;
  }

  form.value.province = String(a.state || "");
  form.value.district = String(a.city || a.town || a.county || "");
  form.value.subDistrict = String(a.suburb || a.quarter || "");
  form.value.postCode = String(a.postcode || "");
}

function reverseGeocode(lat: number, lng: number, showSuccessToast = true) {
  reverseGeoPending = { lat, lng, showSuccessToast };
  if (reverseGeoDebounceTimer) clearTimeout(reverseGeoDebounceTimer);
  reverseGeoDebounceTimer = setTimeout(() => {
    reverseGeoDebounceTimer = null;
    const p = reverseGeoPending;
    reverseGeoPending = null;
    if (p) void runReverseGeocode(p.lat, p.lng, p.showSuccessToast);
  }, 450);
}

const runReverseGeocode = async (
  lat: number,
  lng: number,
  showSuccessToast = true
) => {
  try {
    const res = await nominatimFetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=th,en`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "th,en",
          "User-Agent": "PetSitterApp/1.0 (contact: dev@localhost)",
        },
      }
    );

    if (res.status === 429) {
      showToast(NOMINATIM_429_MSG, "error");
      return;
    }
    if (!res.ok) {
      showToast("Failed to get address", "error");
      return;
    }

    const data = await res.json();
    applyNominatimToAddressForm(data);

    if (showSuccessToast) showToast("Location selected", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to get address", "error");
  }
};

async function fetchLocationSuggestions(value?: string) {
  const q = (value ?? searchQuery.value).trim();
  if (!q) {
    suggestions.value = [];
    return;
  }

  try {
    const res = await nominatimFetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&accept-language=th,en`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "th,en",
          "User-Agent": "PetSitterApp/1.0 (contact: dev@localhost)",
        },
      }
    );

    if (res.status === 429) {
      suggestions.value = [];
      showToast(NOMINATIM_429_MSG, "error");
      return;
    }
    if (!res.ok) {
      suggestions.value = [];
      return;
    }

    suggestions.value = await res.json();
  } catch (err) {
    console.error(err);
    suggestions.value = [];
  }
}

const selectLocation = (item: any) => {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);

  map.setView([lat, lng], 15);
  placeMarkerAt(lat, lng);
  reverseGeocode(lat, lng, true);

  searchQuery.value = item.display_name;
  suggestions.value = [];
};

const handleSave = async () => {
  if (!sitterId.value) {
    showToast("Profile not loaded, please refresh", "error");
    return;
  }

  errors.value.email = "";
  errors.value.phone = "";

  const exp = form.value.experience;
  if (exp === null || exp < 0 || exp > 100) {
    showToast("Please enter experience (years, 0–100)", "error");
    return;
  }

  if (!/^\d{10}$/.test(form.value.phone.trim())) {
    errors.value.phone = MSG_PHONE_10_DIGITS;
    showToast(MSG_PHONE_10_DIGITS, "error");
    return;
  }

  if (!isValidEmailFormat(form.value.email)) {
    errors.value.email = MSG_EMAIL_INVALID;
    showToast(MSG_EMAIL_INVALID, "error");
    return;
  }

  try {
    loading.value = true;
    await updateProfile(sitterId.value, {
      fullName: form.value.fullName.trim(),
      profileImage: form.value.profileImage || null,
      bio: form.value.intro,
      pricePerHour: (form.value as any).pricePerHour,
      experience: exp,
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
      tradeName: form.value.tradeName,
      petTypes: form.value.petTypes,
      services: form.value.services,
      placeDescription: form.value.place,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      gallery: form.value.gallery,
      addressLine: form.value.address,
      district: form.value.district,
      subDistrict: form.value.subDistrict,
      province: form.value.province,
      postalCode: form.value.postCode,
    });
    showToast("Saved successfully", "success");
    window.dispatchEvent(new CustomEvent("petsitter-sitter-profile-updated"));
  } catch (err) {
    console.error(err);
    showToast("Save failed, please try again", "error");
  } finally {
    loading.value = false;
  }
};

const handleRequestApproval = async () => {
  if (!sitterId.value) {
    showToast("Profile not loaded, please refresh", "error");
    return;
  }

  errors.value.fullName = "";
  errors.value.email = "";
  errors.value.phone = "";

  if (!form.value.fullName.trim()) {
    errors.value.fullName = "Full name is required";
    showToast("Please enter your full name", "error");
    return;
  }

  if (!/^\d{10}$/.test(form.value.phone.trim())) {
    errors.value.phone = MSG_PHONE_10_DIGITS;
    showToast(MSG_PHONE_10_DIGITS, "error");
    return;
  }

  if (!isValidEmailFormat(form.value.email)) {
    errors.value.email = MSG_EMAIL_INVALID;
    showToast(MSG_EMAIL_INVALID, "error");
    return;
  }

  if (!form.value.intro.trim()) {
    showToast("Please write your introduction before requesting approval", "error");
    return;
  }

  try {
    requesting.value = true;
    await updateProfile(sitterId.value, {
      fullName: form.value.fullName.trim(),
      profileImage: form.value.profileImage || null,
      bio: form.value.intro.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
    });
    await requestApproval(sitterId.value);
    status.value = "pending";
    rejectionMessage.value = "";
    showToast("Request sent successfully", "success");
    window.dispatchEvent(new CustomEvent("petsitter-sitter-profile-updated"));
  } catch (err: unknown) {
    console.error(err);
    showToast(extractAxiosErrorMessage(err), "error");
  } finally {
    requesting.value = false;
  }
};

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  try {
    loading.value = true;
    const url = await uploadImage(file);
    form.value.profileImage = url;
    showToast("Profile image uploaded", "success");
    window.dispatchEvent(new CustomEvent("petsitter-sitter-profile-updated"));
  } catch (err) {
    console.error(err);
    showToast("Image upload failed, please try again", "error");
  } finally {
    loading.value = false;
    (event.target as HTMLInputElement).value = "";
  }
};

function removeGalleryImage(index: number) {
  form.value.gallery.splice(index, 1);
}

const handleGalleryUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) return;

  const remaining = 10 - form.value.gallery.length;
  if (remaining <= 0) {
    showToast("Maximum 10 gallery images", "error");
    input.value = "";
    return;
  }

  const list = Array.from(files).slice(0, remaining);
  if (files.length > remaining) {
    showToast(`Only ${remaining} more image(s) allowed (max 10)`, "error");
  }

  try {
    loading.value = true;
    for (const file of list) {
      const url = await uploadImage(file);
      form.value.gallery.push(url);
    }
    showToast("Gallery updated", "success");
  } catch (err) {
    console.error(err);
    showToast("Gallery upload failed, please try again", "error");
  } finally {
    loading.value = false;
    input.value = "";
  }
};
</script>