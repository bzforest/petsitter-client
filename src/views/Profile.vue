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
        <InputField label="Experience*" v-model="form.experience" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <InputField label="Phone Number*" v-model="form.phone" />
        <div>
          <InputField label="Email*" v-model="form.email" />
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

    <!-- ADDRESS -->
    <section class="bg-brand-white rounded-2xl p-6 shadow-sm space-y-6">
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
import { ref, onMounted } from "vue";
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

const form = ref({
  fullName: "",
  experience: "",
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
});

const imagePreview = ref<string | null>(null);
const galleryPreview = ref<string[]>([]);
const loading = ref(false);
const requesting = ref(false);
const sitterId = ref<string | null>(null);

let map: any;
let marker: any;

// 🔥 ADD ONLY (search state)
const searchQuery = ref("");
const suggestions = ref<any[]>([]);

onMounted(async () => {
  try {
    const res = await getProfile();
    const data = res.data;

    profile.value = data;
    sitterId.value = data.id;

    form.value.fullName = data.fullName || "";
    form.value.experience = data.experience || "";
    form.value.phone = data.phone || "";
    form.value.email = data.email || "";
    form.value.intro = data.intro || "";
    form.value.tradeName = data.tradeName || "";
    form.value.petTypes = data.petTypes || "";
    form.value.services = data.services || "";
    form.value.place = data.place || "";
    form.value.address = data.address || "";
    form.value.district = data.district || "";
    form.value.subDistrict = data.subDistrict || "";
    form.value.province = data.province || "";
    form.value.postCode = data.postCode || "";
    form.value.profileImage = data.profileImage || "";
    form.value.gallery = data.gallery || [];
    form.value.latitude = data.latitude || null;
    form.value.longitude = data.longitude || null;

    galleryPreview.value = [...form.value.gallery];

    status.value = (data.status || "pending").toLowerCase();
    rejectionMessage.value = data.rejectionMessage || "";

    setTimeout(initMap, 0);
  } catch (err) {
    console.error(err);
    showToast("Failed to load profile, please refresh", "error");
  }
});

const initMap = () => {
  const el = document.getElementById("map");
  if (!el) return;

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

const validate = () => {
  let valid = true;

  errors.value.fullName = "";
  errors.value.email = "";

  if (!form.value.fullName) {
    errors.value.fullName = "Full name is required";
    valid = false;
  }

  if (!form.value.email) {
    errors.value.email = "Email is required";
    valid = false;
  }

  return valid;
};

const handleSave = async () => {
  if (!validate()) {
    showToast("Please fix form errors", "error");
    return;
  }

  if (!sitterId.value) {
    showToast("Profile not loaded, please refresh", "error");
    return;
  }

  try {
    loading.value = true;
    await updateProfile(sitterId.value, form.value);
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