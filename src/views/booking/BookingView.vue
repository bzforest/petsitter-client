<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/api/axios";

import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import ProgressStep from "@/components/ui/ProgressStep.vue";
import Petcard from "@/components/ui/Petcard.vue";
import InputField from "@/components/ui/InputField.vue";
import TextareaField from "@/components/ui/TextareaField.vue";
import PaymentSelection from "@/components/ui/PaymentSelection.vue";
import Button from "@/components/ui/Button.vue";
import PetFormModal from "@/components/pet/PetFormModal.vue";
import StripePayment from "@/components/booking/StripePayment.vue";
import BookingConfirm from "@/components/ui/BookingConfirm.vue";
import { CirclePlus } from "lucide-vue-next";

const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const currentStep = ref(1);
const pets = ref<any[]>([]);
const isLoadingPets = ref(false);
const isSubmitting = ref(false);
const showPetModal = ref(false);
const attemptedNextStep2 = ref(false);
const sitterName = ref("");
const sitterPrice = ref(200);
const sitterPetTypes = ref<string[]>([]);

const paymentMethod = ref("card");
const stripePaymentRef = ref<any>(null);
const showConfirmModal = ref(false);

onMounted(async () => {
  if (!bookingStore.date || !bookingStore.sitterId) {
    router.replace("/");
    return;
  }

  // Initial data prefill
  if (!bookingStore.email && authStore.email) {
    bookingStore.email = authStore.email;
  }

  fetchUserPets();
  fetchSitterInfo();
});

const fetchSitterInfo = async () => {
  try {
    const { data } = await apiClient.get(
      `/api/sitter-profiles/${bookingStore.sitterId}`,
    );
    // 🔥 Balanced fallback: TradeName (if set) else Email (always available)
    sitterName.value = data.tradeName || data.email || "Unknown Sitter";
    sitterPrice.value = data.pricePerHour || 200;
    sitterPetTypes.value = data.petTypes
      ? data.petTypes.split(",").map((t: string) => t.trim())
      : [];

    // ✨ Auto-Cleanup: Remove any selected pets that are not supported by this new sitter
    if (pets.value.length > 0) {
      validateAndCleanupSelectedPets();
    }
  } catch (err) {
    console.error("Failed to fetch sitter info", err);
  }
};

const fetchUserPets = async () => {
  try {
    isLoadingPets.value = true;
    const { data } = await apiClient.get(`/api/pets/user/${authStore.userId}`);
    pets.value = data;
    // Also cleanup if sitter info was already loaded
    if (sitterPetTypes.value.length > 0) {
      validateAndCleanupSelectedPets();
    }
  } catch (err) {
    console.error("Failed to fetch pets", err);
  } finally {
    isLoadingPets.value = false;
  }
};

// Calculate Hours
const hoursDiff = computed(() => {
  if (!bookingStore.startTime || !bookingStore.endTime) return 0;
  const [startH, startM] = bookingStore.startTime.split(":").map(Number);
  const [endH, endM] = bookingStore.endTime.split(":").map(Number);
  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;
  const diff = (endTotalMinutes - startTotalMinutes) / 60;
  return diff > 0 ? diff : 0;
});

// price calculate
const totalPrice = computed(() => {
  const numPets = bookingStore.selectedPetIds.length;
  if (numPets === 0) return 0;

  const basePrice = sitterPrice.value * hoursDiff.value;
  const extraPrice = 100 * hoursDiff.value * (numPets - 1);

  return basePrice + extraPrice;
});

const nextStep = () => {
  if (currentStep.value === 1 && bookingStore.selectedPetIds.length === 0) {
    alert("Please select at least one pet.");
    return;
  }

  if (currentStep.value === 2) {
    attemptedNextStep2.value = true;
    if (!bookingStore.userName || !bookingStore.email || !bookingStore.phone) {
      return;
    }
  }

  if (currentStep.value < 3) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
  else router.back();
};

const submitBooking = async () => {
  try {
    isSubmitting.value = true;

    const payload = {
      sitterId: bookingStore.sitterId,
      petIds: bookingStore.selectedPetIds,
      startDate: bookingStore.date,
      endDate: bookingStore.date,
      startTime: bookingStore.startTime,
      endTime: bookingStore.endTime,
      noteToSitter: bookingStore.additionalMessage,
      paymentMethod: paymentMethod.value === "card" ? "CREDIT_CARD" : "CASH",
    };

    const { data: bookingRes } = await apiClient.post("/api/bookings", payload);

    // If Credit Card, we need to confirm payment via Stripe
    if (paymentMethod.value === "card" && bookingRes.clientSecret) {
      const stripe = stripePaymentRef.value.getStripe();
      const cardNumber = stripePaymentRef.value.getCardNumber();
      const ownerName = stripePaymentRef.value.getCardOwnerName();

      if (!stripe || !cardNumber) {
        throw new Error(
          "Stripe integration failed. Please refresh and try again.",
        );
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        bookingRes.clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name: ownerName,
              email: bookingStore.email,
            },
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment could not be completed at this time.");
      }

      // ✨ NEW: Verify payment with backend since we are on local dev (No Webhook reachable)
      await apiClient.patch(`/api/bookings/${bookingRes.id}/verify-payment`);
    }

    // Success!
    bookingStore.resetBooking();
    router.push(`/booking-success/${bookingRes.id}`);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Booking failed. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const isPetTypeSupported = (type: string) => {
  if (sitterPetTypes.value.length === 0) return true; // Fallback if no types defined
  return sitterPetTypes.value.includes(type);
};

const validateAndCleanupSelectedPets = () => {
  bookingStore.selectedPetIds = bookingStore.selectedPetIds.filter((id) => {
    const pet = pets.value.find((p) => p.id === id);
    // If pet exists and is not supported, filter it out
    return pet ? isPetTypeSupported(pet.type) : true;
  });
};

const togglePet = (id: number) => {
  const index = bookingStore.selectedPetIds.indexOf(id);
  const isCurrentlySelected = index > -1;

  // Find pet type first to check if supported
  const pet = pets.value.find((p) => p.id === id);

  // If trying to SELECT a new pet that is NOT supported -> BLOCK
  if (!isCurrentlySelected && pet && !isPetTypeSupported(pet.type)) return;

  // If already selected, we ALWAYS allow unselecting (fixes user deadlock)
  if (isCurrentlySelected) {
    bookingStore.selectedPetIds.splice(index, 1);
  } else {
    bookingStore.selectedPetIds.push(id);
  }
};

const isPetSelected = (id: number) => bookingStore.selectedPetIds.includes(id);

// Formatting Helpers
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getSelectedPetNames = computed(() => {
  if (bookingStore.selectedPetIds.length === 0) return "-";
  return pets.value
    .filter((p) => bookingStore.selectedPetIds.includes(p.id))
    .map((p) => p.name)
    .join(", ");
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-brand-gray-50 font-sans">
    <Navbar />
    <div class="flex flex-row">
      <main class="flex-1 container mx-auto lg:px-4 lg:py-12 max-w-5xl">
        <!-- Wizard Header -->
        <div
          class="flex items-center justify-around gap-12 mb-12 bg-white p-6 rounded-2xl overflow-x-auto"
        >
          <ProgressStep
            :step="1"
            label="Your Pet"
            :status="
              currentStep === 1
                ? 'active'
                : currentStep > 1
                  ? 'done'
                  : 'inactive'
            "
          />
          <ProgressStep
            :step="2"
            label="Information"
            :status="
              currentStep === 2
                ? 'active'
                : currentStep > 2
                  ? 'done'
                  : 'inactive'
            "
          />
          <ProgressStep
            :step="3"
            label="Payment"
            :status="currentStep === 3 ? 'active' : 'inactive'"
          />
        </div>

        <!-- Step Content Container -->
        <div class="flex flex-col bg-white rounded-2xl lg:p-10 min-h-125">
          <!-- STEP 1: YOUR PET -->
          <div
            v-if="currentStep === 1"
            class="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <p class="body-2 my-10 px-4 lg:mt-0">Choose your pet</p>

            <div v-if="isLoadingPets" class="flex justify-center py-20">
              <div
                class="w-10 h-10 border-4 border-brand-orange-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>

            <div
              v-if="!isLoadingPets"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
            >
              <Petcard
                v-for="pet in pets"
                :key="pet.id"
                :name="pet.name"
                :type="pet.type"
                :image="pet.imageUrl"
                :selectable="true"
                :disabled="!isPetTypeSupported(pet.type)"
                :modelValue="isPetSelected(pet.id)"
                @update:modelValue="togglePet(pet.id)"
                badgeColor="blue"
              />

              <!-- Create New Pet always at the end -->
              <button
                @click="showPetModal = true"
                class="w-60 h-66 bg-brand-orange-50 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-brand-orange-100 transition-colors duration-300"
              >
                <CirclePlus class="w-10 h-10 text-brand-orange-500" />
                <p class="body-2 text-brand-orange-500">Create New Pet</p>
              </button>
            </div>
          </div>

          <!-- STEP 2: INFORMATION -->
          <div
            v-if="currentStep === 2"
            class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 px-4"
          >
            <div class="space-y-8 max-w-3xl">
              <InputField
                label="Name"
                placeholder="Full Name"
                v-model="bookingStore.userName"
                :status="
                  attemptedNextStep2 && !bookingStore.userName
                    ? 'error'
                    : 'normal'
                "
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mt-8">
              <InputField
                label="Email"
                placeholder="Email"
                v-model="bookingStore.email"
                :status="
                  attemptedNextStep2 && !bookingStore.email ? 'error' : 'normal'
                "
              />
              <InputField
                label="Phone"
                placeholder="Phone Number"
                v-model="bookingStore.phone"
                :status="
                  attemptedNextStep2 && !bookingStore.phone ? 'error' : 'normal'
                "
              />
            </div>

            <div class="mt-8 max-w-3xl">
              <TextareaField
                label="Additional Message (To pet sitter)"
                placeholder="Any special instructions?"
                v-model="bookingStore.additionalMessage"
              />
            </div>
          </div>

          <!-- STEP 3: PAYMENT -->
          <div
            v-if="currentStep === 3"
            class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 p-4"
          >
            <div class="flex gap-12">
              <PaymentSelection
                label="Credit Card"
                icon="card"
                value="card"
                v-model="paymentMethod"
                class="cursor-pointer w-full"
              />
              <PaymentSelection
                label="Cash"
                icon="cash"
                value="cash"
                v-model="paymentMethod"
                class="cursor-pointer w-full"
              />
            </div>
            <div v-if="paymentMethod === 'card'">
              <StripePayment ref="stripePaymentRef" />
            </div>
            <div v-else="paymentMethod === 'cash'">
              <div
                class="mt-8 flex flex-col items-center justify-center text-center bg-brand-gray-50 p-10 rounded-2xl gap-6"
              >
                <img
                  src="@/assets/Element Design/Vector.png"
                  alt="Pink Cat footprint"
                />
                <p class="body-2 text-brand-gray-700">
                  If you want to pay by cash, <br />
                  you are required to make a cash payment <br />
                  upon arrival at the pet sitter's location.
                </p>
              </div>
            </div>
          </div>

          <div class="lg:hidden flex flex-col pt-12">
            <!-- header -->
            <div
              class="bg-white lg:rounded-t-2xl p-6 border-b border-brand-gray-100"
            >
              <h3 class="headline-3 text-brand-gray-600">Booking Summary</h3>
            </div>
            <!-- summary -->
            <div class="bg-white rounded-b-2xl p-6 flex flex-col gap-6">
              <div class="flex flex-col">
                <p class="body-3 text-brand-gray-500 font-bold mb-1">
                  Pet Sitter:
                </p>
                <p class="body-2 text-brand-gray-700">{{ sitterName }}</p>
              </div>
              <div class="flex flex-col">
                <p class="body-3 text-brand-gray-500 font-bold mb-1">
                  Date & Time:
                </p>
                <p class="body-2 text-brand-gray-700">
                  {{ formatDate(bookingStore.date) }} |
                  {{ bookingStore.startTime }} -
                  {{ bookingStore.endTime }}
                </p>
              </div>
              <div>
                <p class="body-3 text-brand-gray-500 font-bold mb-1">
                  Duration:
                </p>
                <p class="body-2 text-brand-gray-700">{{ hoursDiff }} hours</p>
              </div>
              <div class="flex flex-col">
                <p class="body-3 text-brand-gray-500 font-bold mb-1">Pet:</p>
                <div>
                  <p class="body-2 text-brand-gray-700">
                    {{ getSelectedPetNames }}
                  </p>
                </div>
              </div>
            </div>
            <!-- total price -->
            <div class="bg-black lg:rounded-b-2xl p-6 flex justify-between">
              <h3 class="headline-3 text-white">Total</h3>
              <h3 class="headline-3 text-white">{{ totalPrice }} THB</h3>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div
            class="lg:mt-12 gap-4 flex flex-row justify-around lg:justify-between items-center py-8 lg:py-0 border-t border-brand-gray-50"
          >
            <Button
              @click="prevStep"
              variant="secondary"
              class="flex items-center gap-2 rounded-full px-12 py-3.5 cursor-pointer"
            >
              Back
            </Button>

            <div class="flex gap-4">
              <Button
                v-if="currentStep < 3"
                variant="primary"
                class="rounded-full px-12 py-3.5 cursor-pointer"
                @click="nextStep"
                :disabled="bookingStore.selectedPetIds.length === 0"
              >
                Next
              </Button>

              <Button
                v-else
                variant="primary"
                class="rounded-full px-12 py-3.5 cursor-pointer"
                @click="showConfirmModal = true"
                :disabled="
                  isSubmitting ||
                  (paymentMethod === 'card' && !stripePaymentRef?.isComplete)
                "
              >
                <div
                  v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"
                ></div>
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </main>

      <!-- Right side summary-->
      <div class="hidden lg:flex flex-col px-4 py-12 w-1/3">
        <!-- header -->
        <div class="bg-white rounded-t-2xl p-6 border-b border-brand-gray-100">
          <h3 class="headline-3 text-brand-gray-600">Booking Summary</h3>
        </div>
        <!-- summary -->
        <div class="bg-white rounded-b-2xl p-6 flex flex-col gap-6">
          <div class="flex flex-col">
            <p class="body-3 text-brand-gray-500 font-bold mb-1">Pet Sitter:</p>
            <p class="body-2 text-brand-gray-700">{{ sitterName }}</p>
          </div>
          <div class="flex flex-col">
            <p class="body-3 text-brand-gray-500 font-bold mb-1">
              Date & Time:
            </p>
            <p class="body-2 text-brand-gray-700">
              {{ formatDate(bookingStore.date) }} |
              {{ bookingStore.startTime }} -
              {{ bookingStore.endTime }}
            </p>
          </div>
          <div>
            <p class="body-3 text-brand-gray-500 font-bold mb-1">Duration:</p>
            <p class="body-2 text-brand-gray-700">{{ hoursDiff }} hours</p>
          </div>
          <div class="flex flex-col">
            <p class="body-3 text-brand-gray-500 font-bold mb-1">Pet:</p>
            <div>
              <p class="body-2 text-brand-gray-700">
                {{ getSelectedPetNames }}
              </p>
            </div>
          </div>
        </div>
        <!-- total price -->
        <div class="bg-black rounded-b-2xl p-6 flex justify-between">
          <h3 class="headline-3 text-white">Total</h3>
          <h3 class="headline-3 text-white">{{ totalPrice }} THB</h3>
        </div>
      </div>
    </div>

    <Footer />

    <!-- Pet Modal -->
    <PetFormModal
      v-if="showPetModal"
      @close="showPetModal = false"
      @saved="fetchUserPets"
    />

    <!-- Final Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <BookingConfirm
        title="Booking Confirmation"
        message="Are you sure to booking this pet sitter?"
        @confirm="
          () => {
            showConfirmModal = false;
            submitBooking();
          }
        "
        @cancel="showConfirmModal = false"
      />
    </div>
  </div>
</template>
