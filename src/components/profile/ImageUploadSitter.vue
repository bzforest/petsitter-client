<script setup lang="ts">
/**
 * รองรับรูปจาก API (previewFromUrl) + preview หลังเลือกไฟล์
 */
import { ref, computed } from "vue";
import { UserRound } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    variant?: "square" | "circle";
    /** URL จาก backend / Supabase หลังโหลดโปรไฟล์ */
    previewFromUrl?: string | null;
  }>(),
  {
    previewFromUrl: null,
  }
);

const emit = defineEmits<{
  (e: "change", event: Event): void;
}>();

const previewUrl = ref<string | null>(null);

const displaySrc = computed(
  () => previewUrl.value || props.previewFromUrl || null
);

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
  emit("change", e);
}

function removeImage() {
  previewUrl.value = null;
}
</script>

<template>
  <template v-if="variant !== 'circle'">
    <label
      v-if="!displaySrc"
      class="flex h-44 w-44 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl bg-brand-orange-50 transition hover:bg-brand-orange-100"
    >
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full border-5 border-brand-orange-700 text-4xl font-bold text-brand-orange-700"
      >
        +
      </div>
      <span class="body-2 font-bold text-brand-orange-700">Upload Image</span>
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />
    </label>

    <div v-else class="relative h-44 w-44">
      <img
        :src="displaySrc"
        alt="Uploaded image preview"
        class="h-full w-full rounded-2xl object-cover"
      />
      <button
        type="button"
        class="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-brand-gray-500 text-sm text-white transition hover:bg-brand-gray-700"
        @click="removeImage"
      >
        ✕
      </button>
    </div>
  </template>

  <template v-else>
    <div class="relative h-44 w-44">
      <div
        class="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-brand-gray-100"
      >
        <img
          v-if="displaySrc"
          :src="displaySrc"
          alt="Profile photo"
          class="h-full w-full object-cover"
        />
        <UserRound v-else class="h-20 w-20 text-brand-white" stroke-width="2" />
      </div>

      <label
        class="absolute -bottom-1 right-1 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand-orange-50 text-4xl font-base text-brand-orange-700 transition hover:bg-brand-orange-100"
      >
        +
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </label>
    </div>
  </template>
</template>
