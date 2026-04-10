<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Menu, MessagesSquare, UserRound } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { getProfileWithCache } from "@/services/sitter.service";

const SITTER_PROFILE_UPDATED = "petsitter-sitter-profile-updated";

const auth = useAuthStore();
const router = useRouter()
const emit = defineEmits<{
  toggleMenu: [];
}>();

// Sitter Navbar state
const sitterFullName = ref("");
const sitterAvatarUrl = ref<string | null>(null);

const sitterDisplayName = computed(() => {
  const n = sitterFullName.value.trim();
  if (n) return n;
  if (auth.email?.trim()) return auth.email.trim();
  return "User";
});

async function loadSitterNavProfile() {
  try {
    const { data } = await getProfileWithCache();
    sitterFullName.value = typeof data?.fullName === "string" ? data.fullName : "";
    sitterAvatarUrl.value =
      typeof data?.profileImage === "string" && data.profileImage ? data.profileImage : null;
  } catch {
    sitterFullName.value = "";
    sitterAvatarUrl.value = null;
  }
}

function onSitterProfileUpdatedEvent() {
  void loadSitterNavProfile();
}

onMounted(() => {
  void loadSitterNavProfile();
  window.addEventListener(SITTER_PROFILE_UPDATED, onSitterProfileUpdatedEvent);
});

onUnmounted(() => {
  window.removeEventListener(SITTER_PROFILE_UPDATED, onSitterProfileUpdatedEvent);
});

function onChatPlaceholderClick() {
  router.push('/chat');
}
</script>

<template>
  <nav
    class="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-brand-gray-100 bg-brand-white px-4 sm:px-6 md:px-10 lg:px-16"
    aria-label="Sitter top navigation"
  >
    <button
      type="button"
      class="mr-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-gray-50 text-brand-gray-700 transition hover:bg-brand-gray-100 md:hidden"
      aria-label="Open menu"
      @click="emit('toggleMenu')"
    >
      <Menu class="h-5 w-5" stroke-width="2" aria-hidden="true" />
    </button>

    <RouterLink
      to="/sitterprofile/profile"
      class="flex min-w-0 flex-1 items-center gap-2 no-underline"
    >
      <span
        class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-brand-gray-100 bg-brand-gray-50"
      >
        <img
          v-if="sitterAvatarUrl"
          :src="sitterAvatarUrl"
          :alt="`Profile photo of ${sitterDisplayName}`"
          class="h-full w-full object-cover"
        />
        <span
          v-else
          class="flex h-full w-full items-center justify-center"
          aria-hidden="true"
        >
          <UserRound class="h-5 w-5 text-brand-gray-400" stroke-width="2" />
        </span>
      </span>

      <span class="body-1 hidden truncate font-medium text-brand-gray-900 sm:block">
        {{ sitterDisplayName }}
      </span>
    </RouterLink>

    <button
      type="button"
      class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-gray-50 text-brand-gray-600 transition hover:bg-brand-gray-100 hover:text-brand-gray-900"
      aria-label="Chat"
      title="Chat"
      @click="onChatPlaceholderClick"
    >
      <MessagesSquare class="h-5 w-5" stroke-width="2" aria-hidden="true" />
    </button>
  </nav>
</template>
