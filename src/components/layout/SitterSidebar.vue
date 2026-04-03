<template>
  <aside
    class="sidebar-shell flex h-screen w-[280px] shrink-0 flex-col justify-between border-r border-brand-gray-100 bg-brand-white"
  >
    <div class="flex min-h-0 flex-1 flex-col px-6">
      <RouterLink
        to="/"
        class="sidebar-brand flex h-16 shrink-0 mt-3 items-center no-underline"
      >
        <img
          src="@/assets/logo/petsitter-logo.svg"
          alt="Sitter"
          class="sidebar-brand-img block h-8 w-auto max-w-full"
        />
      </RouterLink>

      <nav
        class="sidebar-nav mt-8 flex flex-col gap-2"
        aria-label="Sitter navigation"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-nav-link"
          active-class="sidebar-nav-link--active"
        >
          <component
            :is="item.icon"
            class="sidebar-nav-icon h-5 w-5 shrink-0"
            aria-hidden="true"
            stroke-width="2"
          />
          <span class="sidebar-nav-label min-w-0 flex-1 text-left">
            {{ item.label }}
          </span>
          <span
            v-if="item.showDot"
            class="sidebar-nav-dot h-2 w-2 shrink-0 rounded-full bg-brand-orange-700"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>
    </div>

    <div class="sidebar-footer shrink-0 border-t border-brand-gray-100 px-6 pb-8 pt-5">
      <button
        type="button"
        class="sidebar-nav-link sidebar-nav-link--ghost w-full cursor-pointer border-0 bg-transparent text-left font-sans"
        @click="handleLogout"
      >
        <LogOut
          class="sidebar-nav-icon h-5 w-5 shrink-0"
          aria-hidden="true"
          stroke-width="2"
        />
        <span class="sidebar-nav-label">Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { useRouter } from "vue-router";
import { Calendar, CreditCard, List, LogOut, User } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const navItems: { to: string; label: string; icon: Component; showDot?: boolean }[] = [
  { to: "/sitterprofile/profile", label: "Pet Sitter Profile", icon: User },
  { to: "/booking", label: "Booking List", icon: List, showDot: true },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/payout", label: "Payout Option", icon: CreditCard },
];

function handleLogout() {
  auth.logout();
  router.push({ name: "login" });
}
</script>

<style scoped>
/* Keep the sitter sidebar styles isolated */
.sidebar-brand-img {
  max-height: 2rem;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-nav-link:not(.sidebar-nav-link--active):not(.sidebar-nav-link--ghost):hover {
  background-color: var(--color-brand-gray-50);
}

.sidebar-nav-icon {
  color: var(--color-brand-gray-500);
}

.sidebar-nav-label {
  font-size: 0.9375rem;
  line-height: 1.375rem;
  font-weight: 500;
  color: var(--color-brand-gray-900);
}

.sidebar-nav-link--active {
  background-color: var(--color-brand-orange-50);
  /* Compensate px-6 on the column */
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.sidebar-nav-link--active .sidebar-nav-icon {
  color: var(--color-brand-orange-700);
}

.sidebar-nav-link--active .sidebar-nav-label {
  color: var(--color-brand-orange-700);
}

.sidebar-nav-link--ghost .sidebar-nav-icon,
.sidebar-nav-link--ghost .sidebar-nav-label {
  color: var(--color-brand-gray-500);
}

.sidebar-nav-link--ghost:hover {
  background-color: var(--color-brand-gray-50);
}

.sidebar-nav-link--ghost:hover .sidebar-nav-icon,
.sidebar-nav-link--ghost:hover .sidebar-nav-label {
  color: var(--color-brand-gray-900);
}
</style>
