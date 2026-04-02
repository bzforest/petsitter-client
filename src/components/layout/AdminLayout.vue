<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AdminSidebar from "@/components/layout/AdminSidebar.vue";

const collapsed = ref(false);
const route = useRoute();
const authStore = useAuthStore();

const adminInitial = computed(() =>
  (authStore.email?.[0] ?? "A").toUpperCase(),
);

const pageNames: Record<string, string> = {
  "/admin/pet-owners": "Pet Owner",
  "/admin/pet-sitters": "Pet Sitter",
  "/admin/reports": "Report",
};

const currentPageName = computed(() => pageNames[route.path] ?? "Dashboard");
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f4f0]">
    <!-- Sidebar -->
    <AdminSidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />

    <!-- Main area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Topbar -->
      <header
        class="h-14 flex items-center justify-between px-6 bg-[#f5f4f0] border-b border-black/5 flex-shrink-0"
      >
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-black/30 font-medium">Admin</span>
          <span class="text-black/20">›</span>
          <span class="text-black/70 font-semibold">{{ currentPageName }}</span>
        </div>

        <!-- Right: avatar -->
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
          >
            {{ adminInitial }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
