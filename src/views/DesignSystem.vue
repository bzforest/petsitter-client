<script setup lang="ts">
// Best
import ColorPalette from '../components/ui/ColorPalette.vue'
import TypographyShowcase from '../components/ui/TypographyShowcase.vue'
import InputShowcase from '../components/ui/InputShowcase.vue';
import PaginationShowcase from '@/components/ui/PaginationShowcase.vue';
import ReviewShowcase from '@/components/ui/ReviewShowcase.vue';
import BookingCardShowcase from '@/components/ui/BookingCardShowcase.vue';
// foy
import Footer from "@/components/layout/Footer.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import Checkbox from "@/components/ui/Checkbox.vue";
import Radio from "@/components/ui/Radio.vue";
import RatingSelection from "@/components/ui/RatingSelection.vue";
import RatingInput from "@/components/ui/RatingInput.vue";
import PinSelection from "@/components/ui/PinSelection.vue";
import PaymentSelection from "@/components/ui/PaymentSelection.vue";
import Petcard from "@/components/ui/Petcard.vue";
import PetSitterCardLarge from "@/components/ui/PetSitterCardLarge.vue";
import PetSitterCardSmall from "@/components/ui/PetSitterCardSmall.vue";
import { ref } from "vue";



import { SquarePen, Facebook } from "lucide-vue-next";

const checkboxDemo = ref(["Checked"]);
const radioDemo = ref("Checked");
const ratingDemo = ref(5);
const interactiveRatingDemo = ref(3);
const pinDemo = ref(2);
const paymentDemo = ref("cash");
const petSelect1 = ref(false);
const petSelect2 = ref(true);

const largeCardSelected = ref(false);
const largeCardMobileSelected = ref(false);
const smallCardSelected = ref(false);
const smallCardMobileSelected = ref(false);




// Element Design Assets
import elArcYellow from "../assets/Element Design/Ellipse 14.png";
import elStarGreen from "../assets/Element Design/Star 1.png";
import elPawPink from "../assets/Element Design/Vector.png";
import elSliceGreen from "../assets/Element Design/Ellipse 15.png";
import elDotsPill from "../assets/Element Design/Frame 427320928.png";
import elRainbowBlue from "../assets/Element Design/Ellipse 17.png";
import elCircleYellow from "../assets/Element Design/Ellipse 16.png";
import elRingBlue from "../assets/Element Design/Group 25.png";

// Logo Assets
import logoBlack from "../assets/logo/Property 1=black.png";
import logoWhite from "../assets/logo/Property 1=white.png";

// Pet Image
import mrHamImg from "../assets/mr_ham_cat.png";
import houseImg from "../assets/happy_house.png";
import personImg from "../assets/jane_maison.png";

// พื้นที่ของ Jab
import BookingConfirm from "@/components/ui/BookingConfirm.vue";
import RejectConfirmPopup from "@/components/ui/RejectConfirmPopup.vue";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import Navbar from "@/components/layout/Navbar.vue";

const currentStep = ref(1)
const steps = [
  { label: 'Your Pet' },
  { label: 'Information' },
  { label: 'Payment' },
]
</script>



<template>
<!-- Best -->
<div class="p-1 xl:p-8 min-h-screen bg-brand-white">
    <h1 class="display text-brand-orange-700 mb-12 text-center">Pet Sitter Design System</h1>

    <section class="mb-16 p-2 border-b-2 border-brand-gray-300">

      <div class="space-y-8">
        <div class="mb-12">
          <ColorPalette />
          <TypographyShowcase />
          <InputShowcase />
          <PaginationShowcase />
          <ReviewShowcase />
          <BookingCardShowcase />
        </div>
      </div>

    </section>
  </div>



  <!-- Foy -->
  <div class="min-h-screen flex flex-col bg-brand-gray-50 pb-20">
    <!-- Pet Card Section -->
    <main class="flex-grow flex items-center justify-center p-10 pt-20">
      <div class="w-full max-w-6xl bg-white rounded-[40px] shadow-sm p-16">
        <section class="mb-16">
          <h1 class="headline-2 mb-12">Pet Card</h1>
          <div class="p-12 border-2 border-dashed border-brand-orange-100 rounded-[40px] bg-brand-orange-50/20">
            <div class="flex flex-wrap gap-8 justify-center">
              <!-- Type 1: Selectable (Unselected & Selected) -->
              <div class="flex flex-col items-center gap-4">
                <span class="text-brand-gray-300 body-3">Selectable (Unselected & Selected)</span>
                <div class="flex gap-4">
                  <Petcard 
                    name="Mr. Ham" 
                    type="Cat" 
                    :image="mrHamImg" 
                    selectable 
                    v-model="petSelect1" 
                  />
                  <Petcard 
                    name="Mr. Ham" 
                    type="Cat" 
                    :image="mrHamImg" 
                    selectable 
                    v-model="petSelect2" 
                  />
                </div>
              </div>

              <!-- Type 2: Disabled -->
              <div class="flex flex-col items-center gap-4">
                <span class="text-brand-gray-300 body-3">Disabled / Low Opacity</span>
                <Petcard 
                  name="Mr. Ham" 
                  type="Cat" 
                  :image="mrHamImg" 
                  disabled 
                />
              </div>

              <!-- Type 3: Regular Clickable -->
              <div class="flex flex-col items-center gap-4">
                <span class="text-brand-gray-300 body-3">Regular (No check UI)</span>
                <Petcard 
                  name="Mr. Ham" 
                  type="Cat" 
                  :image="mrHamImg" 
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Logo Section First -->

        <section class="mb-16">
          <h1 class="headline-1 mb-8">Logo</h1>
          <div
            class="p-10 border-2 border-dashed border-purple-200 rounded-[32px] w-fit flex flex-col items-center gap-10 bg-white shadow-sm">
            <!-- Full / Black Logo -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-brand-gray-300"></span>
              <img :src="logoBlack" class="h-12 w-auto object-contain" alt="Logo Black" />
            </div>
            <!-- Small / Variation if any, or White on Dark -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-brand-gray-300"></span>
              <div class="bg-brand-gray-900 p-6 rounded-2xl flex items-center justify-center">
                <img :src="logoWhite" class="h-10 w-auto object-contain" alt="Logo White" />
              </div>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16">
          <!-- Booking Status (Column 1) -->
          <section class="space-y-10">
            <div class="relative inline-block">
              <h1 class="headline-2">Booking Status</h1>
            </div>

            <div class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6">
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
              <div class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6">
                <Badge label="Waiting for approve" color="pink" />
                <Badge label="Approved" color="green" />
                <Badge label="Rejected" color="red" />
              </div>
            </section>

            <section class="space-y-6">
              <h2 class="headline-4 text-brand-gray-500">Pet OwnerStatus</h2>
              <div class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6">
                <Badge label="Normal" color="green" />
                <Badge label="Baned" color="red" />
              </div>
            </section>
          </div>

          <!-- Report Status (Column 3) -->
          <section class="space-y-6">
            <h2 class="headline-4 text-brand-gray-500">Report Status</h2>
            <div class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-6">
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
              class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] flex flex-col items-center space-y-6">
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
              <div class="text-brand-gray-300 font-bold headline-3 text-center">
                Primary
              </div>
              <div class="text-brand-gray-300 font-bold headline-3 text-center">
                Secondary
              </div>
              <div class="text-brand-gray-300 font-bold headline-3 text-center">
                Ghost
              </div>
              <div class="text-brand-gray-300 font-bold headline-3 text-center">
                Social
              </div>
              <div class="text-brand-gray-300 font-bold headline-3 text-center">
                Icon
              </div>

              <!-- Normal Row -->
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm">Normal</span>
                <Button variant="primary">
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Normal</span>
                <Button variant="secondary">
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Normal</span>
                <Button variant="ghost">
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Normal</span>
                <Button variant="social">
                  <template #left-icon>
                    <Facebook :size="20" fill="#1877F2" color="#1877F2" />
                  </template>
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
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
                <Button variant="secondary" disabled>
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
                <Button variant="ghost" disabled>
                  <template #left-icon>
                    <SquarePen :size="20" />
                  </template>
                  Primary
                </Button>
              </div>
              <div class="flex flex-col items-center gap-2">
                <span class="text-brand-gray-300 text-sm invisible">Disabled</span>
                <Button variant="social" disabled>
                  <template #left-icon>
                    <Facebook :size="20" />
                  </template>
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
        <!-- Selection Section -->
        <div class="mt-16 w-full">
          <h1 class="headline-2 mb-12">Selection</h1>

          <div class="p-12 border-2 border-dashed border-purple-200 rounded-[40px] bg-[#FAFAFA]/50">
            <div class="flex flex-wrap gap-16 justify-between">
              <!-- 1. Checkbox - Radio -->
              <div class="space-y-10 min-w-[300px]">
                <h2 class="headline-3 text-brand-gray-300">Checkbox - Radio</h2>
                <div class="flex gap-6">
                  <!-- Checkboxes -->
                  <div
                    class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-5 flex flex-col bg-white min-w-[140px]">
                    <Checkbox label="Default" v-model="checkboxDemo" value="Default" />
                    <Checkbox label="Hover" v-model="checkboxDemo" value="Hover" class="border-brand-orange-300" />
                    <Checkbox label="Checked" v-model="checkboxDemo" value="Checked" />
                    <Checkbox label="Disable" v-model="checkboxDemo" value="Disable" disabled />
                  </div>
                  <!-- Radios -->
                  <div
                    class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-5 flex flex-col bg-white min-w-[140px]">
                    <Radio label="Default" value="Default" v-model="radioDemo" />
                    <Radio label="Hover" value="Hover" v-model="radioDemo" class="border-brand-orange-300" />
                    <Radio label="Checked" value="Checked" v-model="radioDemo" />
                    <Radio label="Disable" value="Disable" disabled />
                  </div>
                </div>
              </div>

              <!-- 2. Rating Selection -->
              <div class="space-y-10 min-w-[240px]">
                <h2 class="headline-3 text-brand-gray-300">Rating Selection</h2>
                <div
                  class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] space-y-8 flex flex-col items-center bg-white h-fit justify-center">
                  <!-- Static Choices -->
                  <div class="space-y-4 flex flex-col items-center">
                    <span class="text-brand-gray-300 text-sm">Static Selection</span>
                    <RatingSelection :rating="5" v-model="ratingDemo" />
                    <RatingSelection :rating="4" v-model="ratingDemo" />
                    <RatingSelection :rating="3" v-model="ratingDemo" />
                  </div>

                  <!-- NEW: Interactive Rating Input -->
                  <div class="pt-6 border-t border-brand-gray-50 flex flex-col items-center gap-4">
                    <span class="text-brand-gray-300 text-sm">Interactive Rating Input</span>
                    <RatingInput v-model="interactiveRatingDemo" />
                    <span class="headline-4 text-brand-gray-500">Current: {{ interactiveRatingDemo }}</span>
                  </div>
                </div>
              </div>

              <!-- 3. Pin Selection -->
              <div class="space-y-10 min-w-[200px]">
                <h2 class="headline-3 text-brand-gray-300">Pin Selection</h2>
                <div
                  class="p-8 border-2 border-dashed border-purple-200 rounded-[32px] flex items-center justify-center gap-12 bg-white h-fit min-h-[200px]">
                  <PinSelection :value="1" v-model="pinDemo" />
                  <PinSelection :value="2" v-model="pinDemo" />
                </div>
              </div>

              <!-- 4. Payment Selection -->
              <div class="space-y-10 min-w-[320px]">
                <h2 class="headline-3 text-brand-gray-300 text-center">
                  Payment Selection
                </h2>

                <div
                  class="p-10 border-2 border-dashed border-purple-200 rounded-[27px] bg-white h-fit flex flex-col items-center justify-center gap-6">
                  <PaymentSelection label="Cash" value="cash" v-model="paymentDemo" icon="card" />
                  <PaymentSelection label="Cash" value="card" v-model="paymentDemo" icon="card" />
                  <PaymentSelection label="Cash" value="none" v-model="paymentDemo" icon="card" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Element Design Section -->
        <div class="mt-16 w-full">
          <h1 class="headline-2 mb-12">Element Design</h1>
          <div
            class="p-20 border-2 border-dashed border-purple-200 rounded-[40px] bg-white min-h-[600px] flex items-center justify-center overflow-hidden relative">
            <!-- Composition Container -->
            <div class="relative w-[900px] h-[500px]">
              <!-- Yellow Arc (Top Left) -->
              <img :src="elArcYellow" class="absolute top-20 left-[5%] w-32 h-32 object-contain" alt="Yellow Arc" />
              <!-- Green Star (Top Center-ish) -->
              <img :src="elStarGreen" class="absolute top-15 left-[25%] w-40 h-40 object-contain rotate-[-10deg]"
                alt="Green Star" />
              <!-- Pink Paw (Top Center) -->
              <img :src="elPawPink" class="absolute top-0 left-[50%] w-36 h-36 object-contain" alt="Pink Paw" />
              <!-- Green Slice (Top Right) -->
              <img :src="elSliceGreen" class="absolute top-[-20px] right-[5%] w-48 h-48 object-contain"
                alt="Green Slice" />
              <!-- Pill Dots (Center-ish) -->
              <img :src="elDotsPill" class="absolute top-[230px] right-[32%] w-16 h-8 object-contain opacity-80"
                alt="Pill Dots" />
              <!-- Blue Rainbow (Bottom Left) -->
              <img :src="elRainbowBlue" class="absolute bottom-0 left-0 w-72 h-36 object-contain" alt="Blue Rainbow" />
              <!-- Yellow Circle (Bottom Center) -->
              <img :src="elCircleYellow" class="absolute bottom-[-10px] left-[38%] w-52 h-52 object-contain"
                alt="Yellow Circle" />
              <!-- Blue Ring Shape (Bottom Right) -->
              <img :src="elRingBlue" class="absolute bottom-0 right-0 w-56 h-56 object-contain" alt="Blue Ring" />
            </div>
          </div>
        </div>

        <!-- NEW: Pet Sitter Card (Large) Section -->
        <div class="mt-24 w-full">
          <h1 class="headline-2 mb-12">Pet Sitter Card - Large</h1>
          <div class="p-16 border-2 border-dashed border-purple-200 rounded-[40px] bg-brand-gray-50 flex flex-col gap-12 items-center">
            
            <!-- DESKTOP VERSION -->
            <div class="space-y-6 flex flex-col items-center">
              <span class="text-brand-gray-300 font-bold headline-4">Desktop Version (Normal & Selected)</span>
              <div class="flex flex-col gap-6">
                <!-- Normal -->
                <PetSitterCardLarge 
                  version="desktop"
                  :image="houseImg"
                  :avatar="personImg"
                  title="Happy House!"
                  owner="Jame Maison"
                  location="Senanikom, Bangkok"
                  :rating="5"
                  :tags="[
                    { label: 'Dog', color: 'green' },
                    { label: 'Cat', color: 'pink' },
                    { label: 'Rabbit', color: 'yellow' }
                  ]"
                  :selected="largeCardSelected"
                  @click="largeCardSelected = !largeCardSelected"
                />
              </div>
            </div>

            <!-- MOBILE VERSION (md / mb) -->
            <div class="space-y-6 flex flex-col items-center">
              <span class="text-brand-gray-300 font-bold headline-4">Mobile Version (mb)</span>
              <div class="flex gap-10">
                <PetSitterCardLarge 
                  version="mb"
                  :image="houseImg"
                  :avatar="personImg"
                  title="Happy House!"
                  owner="Jame Maison"
                  location="Senanikom, Bangkok"
                  :rating="5"
                  :tags="[
                    { label: 'Dog', color: 'green' },
                    { label: 'Cat', color: 'pink' },
                    { label: 'Rabbit', color: 'yellow' }
                  ]"
                  :selected="largeCardMobileSelected"
                  @click="largeCardMobileSelected = !largeCardMobileSelected"
                />
              </div>
            </div>

          </div>
        </div>

        <!-- NEW: Pet Sitter Card (Small) Section -->
        <div class="mt-24 w-full">
          <h1 class="headline-2 mb-12">Pet Sitter Card - Small</h1>
          <div class="p-16 border-2 border-dashed border-purple-200 rounded-[40px] bg-brand-gray-50 flex flex-col gap-12 items-center">
            
            <!-- DESKTOP VERSION -->
            <div class="space-y-6 flex flex-col items-center">
              <span class="text-brand-gray-300 font-bold headline-4">Desktop Version (Small)</span>
              <div class="flex flex-col gap-6">
                <PetSitterCardSmall 
                  version="Desktop"
                  :image="houseImg"
                  title="Happy House!"
                  owner="Jame Maison"
                  :rating="5"
                  :tags="[
                    { label: 'Dog', color: 'green' },
                    { label: 'Cat', color: 'pink' },
                    { label: 'Bird', color: 'blue' },
                    { label: 'Rabbit', color: 'yellow' }
                  ]"
                  :selected="smallCardSelected"
                  @click="smallCardSelected = !smallCardSelected"
                />
              </div>
            </div>

            <!-- MOBILE VERSION -->
            <div class="space-y-6 flex flex-col items-center">
              <span class="text-brand-gray-300 font-bold headline-4">Mobile Version (Small)</span>
              <div class="flex flex-col gap-6">
                <PetSitterCardSmall 
                  version="Mobile"
                  :image="houseImg"
                  title="Happy House!"
                  owner="Jame Maison"
                  :rating="5"
                  :tags="[
                    { label: 'Dog', color: 'green' },
                    { label: 'Cat', color: 'pink' },
                    { label: 'Bird', color: 'blue' },
                    { label: 'Rabbit', color: 'yellow' }
                  ]"
                  :selected="smallCardMobileSelected"
                  @click="smallCardMobileSelected = !smallCardMobileSelected"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>

    <Footer />
  </div>

  <!-- Jab Layout -->
  <div class="min-h-screen flex flex-col bg-brand-gray-50">
    <h1 class="headline-4 p-5">1. Navigation Bar</h1>

    <!-- Navbar อยู่บนสุด -->
    <Navbar />
    <!-- Grid Content -->
    <main class="flex-1 grid grid-cols-2 divide-x divide-brand-gray-100">

      <!-- Confirmation Popup -->
      <div class="flex flex-col">
        <header class="flex flex-col p-5">
          <h1 class="headline-4">2. Confirmation Popup</h1>
        </header>
        <main class="grow flex flex-col items-center justify-center space-y-10 p-10">
          <BookingConfirm message="Are you sure to booking this pet sitter?" @confirm="() => { }" @cancel="() => { }" />
          <RejectConfirmPopup message="Are you sure to reject this pet sitter?"
            reasonPlaceholder="Admin's suggestion here" @confirm="() => { }" @cancel="() => { }" />
        </main>
      </div>

      <!-- Image Upload -->
      <div class="flex flex-col">
        <header class="flex flex-col p-5">
          <h1 class="headline-4">3. Image Upload</h1>
        </header>
        <main class="grow flex flex-col items-center justify-center space-y-10 p-10">
          <ImageUpload />
          <ImageUpload variant="circle" />
        </main>
      </div>

      <!-- Progress Step -->
      <div class="flex flex-col col-span-2">
        <header class="flex flex-col p-5">
          <h1 class="headline-4">4. Progress Step</h1>
        </header>
        <main class="grow flex flex-col items-center justify-center space-y-10 p-10">
          <ProgressBar :currentStep="currentStep" :steps="steps" />
          <div class="flex gap-4">
            <button @click="currentStep--" :disabled="currentStep <= 1"
              class="px-4 py-2 rounded-full bg-brand-gray-100 text-brand-gray-700 body-3 disabled:opacity-40">
              Back
            </button>
            <button @click="currentStep++" :disabled="currentStep >= steps.length"
              class="px-4 py-2 rounded-full bg-brand-orange-700 text-white body-3 disabled:opacity-40">
              Next
            </button>
          </div>
        </main>
      </div>

    </main>
  </div>
</template>

