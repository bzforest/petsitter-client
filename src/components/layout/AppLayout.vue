<template>
    <div class="flex h-screen bg-gray-100">
      
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Main -->
      <div class="flex-1 flex flex-col">
  
        <!-- Navbar -->
        <Navbar />
  
        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-view />
        </main>
  
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import Sidebar from './Sidebar.vue'
  import Navbar from './Navbar.vue'
  </script>