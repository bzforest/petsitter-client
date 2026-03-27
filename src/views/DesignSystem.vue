<script setup lang="ts">
// Best
import ColorPalette from '../components/ui/ColorPalette.vue'
import TypographyShowcase from '../components/ui/TypographyShowcase.vue'
import InputShowcase from '../components/ui/InputShowcase.vue';
import PaginationShowcase from '@/components/ui/PaginationShowcase.vue';
import ReviewShowcase from '@/components/ui/ReviewShowcase.vue';
// foy
import Footer from "@/components/layout/Footer.vue";
import Badge from "@/components/ui/Badge.vue";
</script>

<template>
<!-- Best -->
<div class="p-8 min-h-screen bg-brand-white">
    <h1 class="display text-brand-orange-700 mb-12 text-center">Pet Sitter Design System</h1>

    <section class="mb-16 p-6 border-b-2 border-brand-gray-300">

        <div class="space-y-8">
        <div class="mb-12">
          <ColorPalette />
          <TypographyShowcase />
          <InputShowcase />
          <PaginationShowcase />
          <ReviewShowcase />
        </div>
        </div>

    </section>
  </div>



<!-- Foy -->
<div class="min-h-screen flex flex-col bg-brand-gray-50">
    <!-- CENTER CONTAINER -->
    <main class="flex-grow flex items-center justify-center p-10 pt-20">
      <div class="w-full max-w-6xl bg-white rounded-[40px] shadow-sm p-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16">
          <!-- Booking Status (Column 1) -->
          <section class="space-y-10">
            <div class="relative inline-block">
              <h1 class="headline-2">Booking Status</h1>
            </div>

            <div
              class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6"
            >
              <Badge label="Waiting for confirm" color="pink" />
              <Badge label="Waiting for service" color="yellow" />
              <Badge label="In service" color="blue" />
              <Badge label="Success" color="green" />
              <Badge label="Canceled" color="red" />
            </div>
          </section>

          <!-- Status Group 2 (Column 2) -->
          <div class="space-y-16">
            <section class="space-y-6">
              <h2 class="headline-4 text-brand-gray-500">Pet Sitter Status</h2>
              <div
                class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6"
              >
                <Badge label="Waiting for approve" color="pink" />
                <Badge label="Approved" color="green" />
                <Badge label="Rejected" color="red" />
              </div>
            </section>

            <section class="space-y-6">
              <h2 class="headline-4 text-brand-gray-500">Pet OwnerStatus</h2>
              <div
                class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6"
              >
                <Badge label="Normal" color="green" />
                <Badge label="Baned" color="red" />
              </div>
            </section>
          </div>

          <!-- Report Status (Column 3) -->
          <section class="space-y-6">
            <h2 class="headline-4 text-brand-gray-500">Report Status</h2>
            <div
              class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6"
            >
              <Badge label="New Report" color="pink" />
              <Badge label="Pending" color="blue" />
              <Badge label="Resolved" color="green" />
              <Badge label="Canceled" color="red" />
            </div>
          </section>

          <!-- Pet Type (Column 4) -->
          <section class="space-y-6">
            <h2 class="headline-4 text-brand-gray-500">Pet Type</h2>
            <div
              class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] flex flex-col items-center space-y-6"
            >
              <Badge label="Dog" color="green" variant="pill" />
              <Badge label="Cat" color="pink" variant="pill" />
              <Badge label="Bird" color="blue" variant="pill" />
              <Badge label="Rabbit" color="yellow" variant="pill" />
            </div>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>

</template>