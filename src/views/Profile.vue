<template>
  <div class="max-w-[1000px] mx-auto p-6 space-y-6">

    <!-- HEADER -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="headline-4 text-brand-gray-900">Pet Sitter Profile</h1>

        <span v-if="status === 'approved'" class="body-3 text-brand-green-500 font-medium">
          • Approved
        </span>
        <span v-else-if="status === 'pending'" class="body-3 text-brand-orange-700 font-medium">
          • Waiting for approve
        </span>
        <span v-else-if="status === 'rejected'" class="body-3 text-brand-red-500 font-medium">
          • Rejected
        </span>
      </div>

      <!-- approved → Update (บันทึกข้อมูล) -->
      <Button v-if="status === 'approved'" @click="handleSave" :disabled="loading">
        {{ loading ? "Saving..." : "Update" }}
      </Button>

      <!-- pending / rejected → Request for approval -->
      <Button v-else @click="handleRequestApproval" :disabled="requesting">
        {{ requesting ? "Sending..." : "Request for approval" }}
      </Button>
    </header>

    <!-- REJECTED ALERT BANNER -->
    <div
      v-if="status === 'rejected'"
      class="flex items-center gap-3 bg-brand-gray-50 border border-brand-gray-100 text-brand-gray-700 px-4 py-3 rounded-xl body-3"
    >
      <AlertCircle class="w-5 h-5 shrink-0 text-brand-red-500" />
      <span>Your request has not been approved: {{ rejectionMessage }}</span>
    </div>

    <!-- BASIC INFORMATION -->
    <section class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6">
      <h2 class="body-1 font-bold text-brand-gray-900">Basic Information</h2>

      <div class="space-y-2">
        <p class="body-3 text-brand-gray-500">Profile Image</p>
        <ImageUpload variant="circle" @change="handleImageUpload" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <InputField label="Your full name*" v-model="form.fullName" />
          <p v-if="errors.fullName" class="text-brand-red-500 body-3 mt-1">
            {{ errors.fullName }}
          </p>
        </div>
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

    <!-- PET SITTER -->
    <section class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6">
      <h2 class="body-1 font-bold text-brand-gray-900">Pet Sitter</h2>

      <div class="grid grid-cols-2 gap-4">
        <InputField label="Trade Name" v-model="form.tradeName" />
        <InputField label="Pet Types" v-model="form.petTypes" />
      </div>

      <TextareaField label="Services" v-model="form.services" />
      <TextareaField label="My Place" v-model="form.place" />

      <div class="space-y-2">
        <p class="body-3 text-brand-gray-500">Gallery</p>
        <div class="flex gap-4 flex-wrap">
          <ImageUpload @change="handleGalleryUpload" />
          <ImageUpload @change="handleGalleryUpload" />
          <ImageUpload @change="handleGalleryUpload" />
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
          @update:modelValue="handleSearch"
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
import { ref, computed, onMounted, nextTick } from "vue";
import { getProfile, updateProfile, requestApproval } from "../services/sitter.service";
import { uploadImage } from "@/services/supabase.service";
import { useToast } from "@/composables/useToast";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { AlertCircle } from "lucide-vue-next";
import InputField from "@/components/ui/InputField.vue";
import TextareaField from "@/components/ui/TextareaField.vue";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import Button from "@/components/ui/Button.vue";

const { showToast } = useToast();

const profile = ref<any>(null);

const status = ref<"approved" | "pending" | "rejected">("pending");
const rejectionMessage = ref("");

const statusMap: Record<string, "approved" | "pending" | "rejected"> = {
  APPROVED: "approved",
  WAITING_FOR_APPROVE: "pending",
  REJECTED: "rejected",
};

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

const errors = ref({
  fullName: "",
  email: "",
  phone: "",
});

const MSG_PHONE_10_DIGITS = "Phone number must be exactly 10 digits.";
const MSG_EMAIL_INVALID =
  "Enter a valid email address. It must include @ and a domain (e.g. name@example.com).";

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

const imagePreview = ref<string | null>(null);
const galleryPreview = ref<string[]>([]);
const loading = ref(false);
const requesting = ref(false);
const sitterId = ref<number | null>(null);

let map: any;
let marker: any;

// 🔥 ADD ONLY (search state)
const searchQuery = ref("");
const suggestions = ref<any[]>([]);

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

    galleryPreview.value = [...form.value.gallery];

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

  if (form.value.latitude && form.value.longitude) {
    marker = L.marker([form.value.latitude, form.value.longitude], { draggable: true }).addTo(map);

    marker.on("dragend", (e: any) => {
      const pos = e.target.getLatLng();
      form.value.latitude = pos.lat;
      form.value.longitude = pos.lng;
      reverseGeocode(pos.lat, pos.lng);
    });
  }

  map.on("click", (e: any) => {
    const { lat, lng } = e.latlng;

    if (marker) map.removeLayer(marker);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    form.value.latitude = lat;
    form.value.longitude = lng;

    reverseGeocode(lat, lng);

    marker.on("dragend", (e: any) => {
      const pos = e.target.getLatLng();
      form.value.latitude = pos.lat;
      form.value.longitude = pos.lng;
      reverseGeocode(pos.lat, pos.lng);
    });
  });
};

// 🔥 ADD ONLY
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await res.json();
    const address = data.address || {};

    form.value.address = data.display_name || "";
    form.value.province = address.state || "";
    form.value.district = address.city || address.town || "";
    form.value.subDistrict = address.suburb || "";
    form.value.postCode = address.postcode || "";

    showToast("Location selected", "success");

  } catch (err) {
    console.error(err);
    showToast("Failed to get address", "error");
  }
};

// 🔥 ADD ONLY (search)
const handleSearch = async (value?: string) => {
  const q = value ?? searchQuery.value;
  if (!q) {
    suggestions.value = [];
    return;
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${q}`
  );

  suggestions.value = await res.json();
};

const selectLocation = (item: any) => {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);

  map.setView([lat, lng], 15);

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng], { draggable: true }).addTo(map);

  form.value.latitude = lat;
  form.value.longitude = lng;

  reverseGeocode(lat, lng);

  searchQuery.value = item.display_name;
  suggestions.value = [];

  marker.on("dragend", (e: any) => {
    const pos = e.target.getLatLng();
    form.value.latitude = pos.lat;
    form.value.longitude = pos.lng;
    reverseGeocode(pos.lat, pos.lng);
  });
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

  try {
    requesting.value = true;
    await requestApproval(sitterId.value);
    status.value = "pending";
    showToast("Request sent successfully", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to send request, please try again", "error");
  } finally {
    requesting.value = false;
  }
};

const handleImageUpload = async (event: any) => {
  const file = event?.target?.files?.[0];
  if (!file) return;

  try {
    loading.value = true;
    imagePreview.value = URL.createObjectURL(file);
    const url = await uploadImage(file);
    form.value.profileImage = url;
    showToast("Profile image uploaded", "success");
  } catch (err) {
    console.error(err);
    showToast("Image upload failed, please try again", "error");
  } finally {
    loading.value = false;
  }
};

const handleGalleryUpload = async (event: any) => {
  const files = event?.target?.files;
  if (!files) return;

  try {
    loading.value = true;

    for (const file of Array.from(files as FileList)) {
      const preview = URL.createObjectURL(file);
      galleryPreview.value.push(preview);

      const url = await uploadImage(file);
      form.value.gallery.push(url);
    }

    showToast("Gallery uploaded", "success");
  } catch (err) {
    console.error(err);
    showToast("Gallery upload failed, please try again", "error");
  } finally {
    loading.value = false;
  }
};
</script>