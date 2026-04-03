<template>
  <section class="flex h-screen bg-gray-100">
    <!-- Sitter Sidebar -->
    <SitterSidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <!-- Sitter Navbar -->
      <SitterNavbar />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import SitterSidebar from './SitterSidebar.vue'
import SitterNavbar from './SitterNavbar.vue'
</script>
