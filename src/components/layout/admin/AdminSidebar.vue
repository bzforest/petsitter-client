<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import adminLogo from "@/assets/logo/AdminSidebar-logo.svg";
import Profile from "@/components/icons/Profile.vue";
import Logout from "@/components/icons/Logout.vue";
import Paws from "@/components/icons/Paws.vue";
import IconBell from "@/components/icons/IconBell.vue";

// ── Store ──────────────────────────────────────────────────
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// ตรวจ active โดยเช็ค path ปัจจุบันว่า startsWith item path
// วิธีนี้ทำให้ /admin/pet-sitters/8 ยังคง active "Pet Sitter" ไว้
function isActive(to: string): boolean {
  return route.path.startsWith(to);
}

const adminEmail = computed(() => authStore.email ?? "admin@sitter.com");
const adminInitial = computed(() =>
  (authStore.email?.[0] ?? "A").toUpperCase(),
);

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}

// ── Inline SVG icon components ────────────────────────────
const IconOwner = defineComponent({
  render: () =>
    h(Profile, {
      size: 24,
      color: "currentColor",
    }),
});

const IconSitter = defineComponent({
  render: () =>
    h(Paws, {
      size: 24,
      color: "currentColor",
    }),
});

const IconReport = defineComponent({
  render: () =>
    h(IconBell, {
      size: 24,
      color: "currentColor",
    }),
});

const IconLogout = defineComponent({
  render: () =>
    h(Logout, {
      size: 24,
      color: "currentColor",
    }),
});

// ── Nav items ──────────────────────────────────────────────
const navItems = [
  { to: "/admin/pet-owners", label: "Pet Owner", icon: IconOwner },
  { to: "/admin/pet-sitters", label: "Pet Sitter", icon: IconSitter },
  { to: "/admin/reports", label: "Report", icon: IconReport },
];
</script>

<template>
  <aside
    class="flex flex-col h-screen bg-brand-black text-white transition-all duration-300 ease-in-out relative"
    :class="'w-[240px]'"
  >
    <!-- Logo -->
    <div class="px-6 py-10 overflow-hidden">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <img :src="adminLogo" alt="Admin Logo" class="w-[132px] h-[40px]" />
      </div>
      <p
        class="body-2 text-brand-gray-500 mt-1 font-medium italic"
      >
        Admin Panel
      </p>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 flex flex-col gap-0.5 overflow-hidden">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-5 py-5 transition-all duration-150 relative"
        :class="
          isActive(item.to)
            ? 'text-white bg-white/6 sidebar-active'
            : 'text-white/40 hover:text-white/80 hover:bg-white/15'
        "
      >
        <!-- Active indicator bar -->
        <span
          class="absolute left-0 top-1/4 h-1/2 w-[3px] bg-orange-500 rounded-r-full transition-opacity duration-150"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-0'"
        />

        <!-- Icon -->
        <span class="shrink-0 flex items-center justify-center">
          <component :is="item.icon" class="w-[30px] h-[30px]" />
        </span>

        <!-- Label -->
        <span class="body-1 font-medium whitespace-nowrap overflow-hidden transition-all duration-200">
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div
      class="px-3 pb-5 pt-3 border-t border-white/15 flex flex-col gap-1 overflow-hidden"
    >
      <!-- Admin info -->
      <div
        class="flex items-center gap-2.5 px-2 py-2 mb-1 overflow-hidden"
      >
        <div
          class="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-xs font-bold shrink-0"
        >
          {{ adminInitial }}
        </div>
        <div class="overflow-hidden">
          <p class="text-xs text-white/70 font-medium truncate">
            {{ adminEmail }}
          </p>
          <p class="text-[10px] text-white/25 uppercase tracking-wide">Admin</p>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-3 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full group relative"
      >
        <span class="w-5 h-5 shrink-0 flex items-center justify-content">
          <IconLogout class="w-[24px] h-[24px]" />
        </span>
        <span class="body-1 font-medium whitespace-nowrap">Log Out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Active state needs a small custom class because Tailwind can't do group-active-class */
.sidebar-active {
  background: rgba(255, 255, 255, 0.06) !important;
}
.sidebar-active .absolute {
  opacity: 1 !important;
}
</style>
