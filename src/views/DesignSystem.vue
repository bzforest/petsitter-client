<script setup lang="ts">
// พื้นที่ของ Best
// ใน Vue 3 เราจะใช้ <script setup> เป็นหลักครับ มันช่วยให้เขียนโค้ดสั้นลงและอ่านง่ายขึ้น
// เดี๋ยวเราจะทำการ Import component ต่างๆ ที่คุณเบสท์สร้าง มาไว้ตรงนี้ครับ
// ตัวอย่าง:
// import Navbar from '@/components/layout/Navbar.vue'
// import InputField from '@/components/ui/InputField.vue'

// พื้นที่ของ Foy
import Footer from "@/components/layout/Footer.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import { SquarePen, Facebook } from 'lucide-vue-next';
</script>

<template>
<!-- Best -->

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

      <!-- Button Section (FULL WIDTH) -->
      <div class="mt-16 w-full">
        <h1 class="headline-2 mb-12">Buttons</h1>

        <div class="p-12 border-2 border-dashed border-purple-200 rounded-[40px]">
          <div class="grid grid-cols-5 gap-y-12 items-center">
            <!-- Headers -->
            <div class="text-brand-gray-300 font-bold headline-3 text-center">Primary</div>
            <div class="text-brand-gray-300 font-bold headline-3 text-center">Secondary</div>
            <div class="text-brand-gray-300 font-bold headline-3 text-center">Ghost</div>
            <div class="text-brand-gray-300 font-bold headline-3 text-center">Social</div>
            <div class="text-brand-gray-300 font-bold headline-3 text-center">Icon</div>

            <!-- Normal Row -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-brand-gray-300 text-sm">Normal</span>
              <Button variant="primary">
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
               <span class="text-brand-gray-300 text-sm invisible">Normal</span>
              <Button variant="secondary">
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
               <span class="text-brand-gray-300 text-sm invisible">Normal</span>
              <Button variant="ghost">
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
               <span class="text-brand-gray-300 text-sm invisible">Normal</span>
              <Button variant="social">
                <template #left-icon><Facebook :size="20" fill="#1877F2" color="#1877F2" /></template>
                Facebook
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
               <span class="text-brand-gray-300 text-sm invisible">Normal</span>
              <Button variant="icon">
                <SquarePen :size="24" />
              </Button>
            </div>

            <!-- Disabled Row -->
            <div class="flex flex-col items-center gap-2">
               <span class="text-brand-gray-300 text-sm">Disabled</span>
              <Button variant="primary" disabled>
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
              <Button variant="secondary" disabled>
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
              <Button variant="ghost" disabled>
                <template #left-icon><SquarePen :size="20" /></template>
                Primary
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
              <Button variant="social" disabled>
                <template #left-icon><Facebook :size="20" /></template>
                Facebook
              </Button>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
              <Button variant="icon" disabled>
                <SquarePen :size="24" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>

    <Footer />
  </div>
</template>