<script setup lang="ts">
import type { PetResponse } from "@/services/pet.service";

defineProps<{
  pet: PetResponse | null;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <section class="w-full max-w-2xl rounded-2xl bg-brand-white p-8 shadow-xl">
    <header class="mb-6 flex items-center justify-between">
      <h2 class="headline-4 text-brand-gray-900">Pet Detail</h2>
      <button
        type="button"
        class="cursor-pointer text-2xl text-brand-gray-300 transition hover:text-brand-gray-700"
        aria-label="Close pet detail"
        @click="$emit('close')"
      >
        ✕
      </button>
    </header>

    <article v-if="pet">
      <section class="flex min-h-88 flex-col gap-6 md:flex-row md:items-start">
        <section class="flex w-full flex-col items-center gap-3 md:w-52 md:shrink-0">
          <img
            :src="pet.imageUrl"
            :alt="`Photo of ${pet.name}`"
            class="h-28 w-28 rounded-full object-cover md:h-32 md:w-32"
          />
          <p class="headline-4 text-brand-gray-900">{{ pet.name }}</p>
        </section>

        <section class="flex-1 rounded-xl bg-brand-gray-50 p-6">
          <dl class="grid grid-cols-2 gap-x-8 gap-y-4">
            <section>
              <dt class="body-3 text-brand-gray-300">Pet Type</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.type || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Breed</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.breed || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Sex</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.sex || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Age</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.age }} years</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Weight</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.weight }} kg</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">About</dt>
              <dd class="body-3 text-brand-gray-700">{{ pet.aboutPet || "-" }}</dd>
            </section>
          </dl>
        </section>
      </section>
    </article>
  </section>
</template>
