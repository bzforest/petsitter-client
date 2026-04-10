<template>
  <section class="flex min-h-screen bg-gray-100">
    <section class="hidden md:block">
      <SitterSidebar />
    </section>

    <!-- Mobile drawer -->
    <section
      v-if="mobileSidebarOpen"
      class="fixed inset-0 z-70 md:hidden"
      aria-label="Mobile sidebar"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/40"
        aria-label="Close sidebar overlay"
        @click="mobileSidebarOpen = false"
      />
      <section class="relative h-full w-[280px] max-w-[85vw]">
        <SitterSidebar />
      </section>
    </section>

    <div class="flex min-w-0 flex-1 flex-col">
      <SitterNavbar @toggle-menu="mobileSidebarOpen = !mobileSidebarOpen" />

      <main class="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['SitterBookingList', 'SitterCalendar']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import SitterSidebar from "./SitterSidebar.vue";
import SitterNavbar from "./SitterNavbar.vue";

const mobileSidebarOpen = ref(false);
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    mobileSidebarOpen.value = false;
  }
);
</script>
