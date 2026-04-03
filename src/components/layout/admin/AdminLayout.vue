<script setup lang="ts">
import AdminSidebar from "@/components/layout/admin/AdminSidebar.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-brand-white">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Page content -->
    <main class="flex-1 overflow-auto p-6">
      <RouterView />
    </main>
  </div>
</template>
