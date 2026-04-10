<script setup lang="ts">
interface OwnerProfileLite {
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string | null;
  idNumber?: string;
  dateOfBirth?: string;
}

function formatDob(value?: string): string {
  if (!value || value === "-") return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

defineProps<{
  profile: OwnerProfileLite | null;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <section class="w-full max-w-3xl rounded-2xl bg-brand-white p-8 shadow-xl">
    <header class="mb-4 flex items-center justify-between">
      <h2 class="headline-4 text-brand-gray-900">{{ profile?.fullName || "Owner" }}</h2>
      <button
        type="button"
        class="cursor-pointer text-2xl text-brand-gray-300 transition hover:text-brand-gray-700"
        aria-label="Close owner profile"
        @click="$emit('close')"
      >
        ✕
      </button>
    </header>

    <article v-if="profile">
      <section class="flex min-h-76 flex-col gap-6 md:flex-row md:items-start">
        <section class="flex w-full justify-center md:w-52 md:shrink-0">
          <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-brand-gray-100 body-1 text-brand-gray-700">
            <img
              v-if="profile.profileImage"
              :src="profile.profileImage"
              :alt="`Profile photo of ${profile.fullName || 'owner'}`"
              class="h-full w-full object-cover"
            />
            <span v-else>{{ profile.fullName?.charAt(0) || "U" }}</span>
          </div>
        </section>

        <section class="flex-1 rounded-md bg-brand-gray-50 p-5">
          <dl class="space-y-2">
            <section>
              <dt class="body-3 text-brand-gray-300">Pet Owner Name</dt>
              <dd class="body-3 text-brand-gray-700">{{ profile.fullName || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Email</dt>
              <dd class="body-3 text-brand-gray-700">{{ profile.email || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Phone</dt>
              <dd class="body-3 text-brand-gray-700">{{ profile.phone || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">ID Number</dt>
              <dd class="body-3 text-brand-gray-700">{{ profile.idNumber || "-" }}</dd>
            </section>
            <section>
              <dt class="body-3 text-brand-gray-300">Date of Birth</dt>
              <dd class="body-3 text-brand-gray-700">{{ formatDob(profile.dateOfBirth) }}</dd>
            </section>
          </dl>
        </section>
      </section>
    </article>
  </section>
</template>
