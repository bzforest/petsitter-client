<template>
  <div class="p-10 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Pet Sitter Profile</h1>

    <div class="bg-white p-8 rounded-xl shadow-md max-w-2xl">

      <!-- Profile Image -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="w-full h-full object-cover"
          />
          <span v-else>+</span>
        </div>

        <input type="file" @change="handleImageUpload" />
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Full Name</label>
        <input
          v-model="form.fullName"
          class="w-full border p-2 rounded"
        />
      </div>

      <!-- Experience -->
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Experience</label>
        <input
          v-model="form.experience"
          class="w-full border p-2 rounded"
        />
      </div>

      <!-- Price -->
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Price / Hour</label>
        <input
          type="number"
          v-model="form.pricePerHour"
          class="w-full border p-2 rounded"
        />
      </div>

      <!-- Save Button -->
      <button
        class="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
      >
        Save
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getProfile } from "../services/sitter.service";

const profile = ref<any>(null);

const form = ref({
  fullName: "",
  experience: "",
  pricePerHour: 0,
});

const imagePreview = ref<string | null>(null);

onMounted(async () => {
  const res = await getProfile();
  profile.value = res.data;

  // bind data เข้า form
  form.value.fullName = res.data.fullName;
  form.value.experience = res.data.experience;
  form.value.pricePerHour = res.data.pricePerHour;
});

// preview image
const handleImageUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
};
</script>