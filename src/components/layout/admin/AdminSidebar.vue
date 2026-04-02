<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import adminLogo from "@/assets/logo/AdminSidebar-logo.svg";

// ── Props & Emits ──────────────────────────────────────────
defineProps<{ collapsed: boolean }>();
defineEmits<{ toggle: [] }>();

// ── Store ──────────────────────────────────────────────────
const router = useRouter();
const authStore = useAuthStore();

const adminEmail = computed(() => authStore.email ?? "admin@sitter.com");
const adminInitial = computed(() =>
  (authStore.email?.[0] ?? "A").toUpperCase(),
);

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

// ── Inline SVG icon components ────────────────────────────
const IconOwner = defineComponent({
  render: () =>
    h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.8",
      },
      [
        h("circle", { cx: "12", cy: "8", r: "4" }),
        h("path", { d: "M4 20c0-4 3.6-7 8-7s8 3 8 7" }),
      ],
    ),
});

const IconSitter = defineComponent({
  render: () =>
    h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.8",
      },
      [
        h("path", {
          d: "M12 3C9 3 6.5 5.5 6.5 8.5c0 2 1 3.8 2.5 4.9V15l3 1.5 3-1.5v-1.6c1.5-1.1 2.5-2.9 2.5-4.9C17.5 5.5 15 3 12 3z",
        }),
        h("path", {
          d: "M9.5 9.5c-.4.8-1.2 1.2-1.5 1.8M14.5 9.5c.4.8 1.2 1.2 1.5 1.8",
        }),
      ],
    ),
});

const IconReport = defineComponent({
  render: () =>
    h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.8",
      },
      [
        h("rect", { x: "4", y: "3", width: "16", height: "18", rx: "2" }),
        h("path", { d: "M8 8h8M8 12h8M8 16h5" }),
      ],
    ),
});

const IconLogout = defineComponent({
  render: () =>
    h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.8",
      },
      [
        h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
        h("polyline", { points: "16 17 21 12 16 7" }),
        h("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
      ],
    ),
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
    :class="collapsed ? 'w-[68px]' : 'w-[240px]'"
  >
    <!-- Logo -->
    <div class="px-5 py-10 overflow-hidden">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <img :src="adminLogo" alt="Admin Logo" class="w-[132px] h-[40px]" />
      </div>
      <p
        v-if="!collapsed"
        class="body-2 text-brand-white uppercase mt-1 font-medium"
      >
        Admin Panel
      </p>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 px-3 pt-4 flex flex-col gap-0.5 overflow-hidden">
      

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-150 group relative"
        active-class="!text-white !bg-white/8 sidebar-active"
      >
        <!-- Active indicator -->
        <span
          class="absolute left-0 top-1/4 h-1/2 w-[3px] bg-orange-500 rounded-r-full opacity-0 transition-opacity duration-150 group-[.sidebar-active]:opacity-100"
        >
        </span>

        <!-- Icon -->
        <span class="w-5 h-5 shrink-0 flex items-center justify-center">
          <component :is="item.icon" class="w-[18px] h-[18px]" />
        </span>

        <!-- Label -->
        <span
          v-if="!collapsed"
          class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
        >
          {{ item.label }}
        </span>

        <!-- Tooltip when collapsed -->
        <div
          v-if="collapsed"
          class="absolute left-full ml-3 px-2.5 py-1 bg-[#222] text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50"
        >
          {{ item.label }}
        </div>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div
      class="px-3 pb-5 pt-3 border-t border-white/5 flex flex-col gap-1 overflow-hidden"
    >
      <!-- Admin info -->
      <div
        v-if="!collapsed"
        class="flex items-center gap-2.5 px-2 py-2 mb-1 overflow-hidden"
      >
        <div
          class="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-xs font-bold flex-shrink-0"
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
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full group relative"
      >
        <span class="w-5 h-5 flex-shrink-0 flex items-center justify-content">
          <IconLogout class="w-[18px] h-[18px]" />
        </span>
        <span v-if="!collapsed" class="text-sm font-medium whitespace-nowrap"
          >Log Out</span
        >

        <!-- Tooltip -->
        <div
          v-if="collapsed"
          class="absolute left-full ml-3 px-2.5 py-1 bg-[#222] text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50"
        >
          Log Out
        </div>
      </button>
    </div>

    <!-- Collapse toggle -->
    <button
      @click="$emit('toggle')"
      class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1e1e1e] border border-white/10 text-white/40 hover:text-white hover:bg-[#2a2a2a] flex items-center justify-center transition-all duration-150 z-20"
    >
      <svg
        class="w-3 h-3 transition-transform duration-300"
        :class="collapsed ? 'rotate-180' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
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
