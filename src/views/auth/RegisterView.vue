<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Form state สำหรับการลงทะเบียน
const selectedRole = ref<"USER" | "SITTER">("USER");
const email = ref("");
const phone = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

// Field-level errors from API สำหรับการแสดงข้อผิดพลาดจาก API
const errors = ref<{
  email?: string;
  phone?: string;
  password?: string;
  general?: string;
}>({});

const buttonLabel = computed(() =>
  selectedRole.value === "USER" ? "Register as Owner" : "Register as Sitter",
);

function selectRole(role: "USER" | "SITTER") {
  selectedRole.value = role;
  errors.value = {};
}

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = undefined;
}

function parseApiErrors(err: unknown) {
  // Spring Boot validation errors come back as an array or a string
  const data = (err as any)?.response?.data;
  if (!data) {
    errors.value.general = "Something went wrong. Please try again.";
    return;
  }

  // Spring Boot @Valid returns { fieldErrors: [{field, message}] } or a plain message string
  if (typeof data === "string") {
    errors.value.general = data;
    return;
  }

  if (Array.isArray(data)) {
    data.forEach((e: { field: string; message: string }) => {
      if (
        e.field in errors.value ||
        ["email", "password", "phone"].includes(e.field)
      ) {
        (errors.value as Record<string, string>)[e.field] = e.message;
      }
    });
    return;
  }

  // Common Spring Boot GlobalExceptionHandler pattern: { message: string } or { errors: [...] }
  if (data.errors && Array.isArray(data.errors)) {
    data.errors.forEach((e: { field: string; message: string }) => {
      if (["email", "password", "phone"].includes(e.field)) {
        (errors.value as Record<string, string>)[e.field] = e.message;
      }
    });
    return;
  }

  errors.value.general = data.message ?? "Registration failed.";
}

async function handleSubmit() {
  errors.value = {};
  isLoading.value = true;
  try {
    await authStore.register({
      email: email.value,
      phone: phone.value,
      password: password.value,
      role: selectedRole.value,
    });
    await router.push("/login");
  } catch (err) {
    parseApiErrors(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-white flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-brand-white p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="headline-1 font-bold text-gray-900 mb-2">Join Us!</h1>
        <p class="text-brand-gray-500 headline-3 font-bold">
          Find your perfect pet sitter with us
        </p>
      </div>

      <!-- Role Toggle -->
      <div class="flex bg-gray-100 rounded-full p-1 mb-8">
        <button
          type="button"
          :class="[
            'flex-1 py-2 rounded-full text-base font-bold transition-all duration-400',
            selectedRole === 'USER'
              ? 'bg-brand-white text-brand-orange-700 shadow-sm'
              : 'text-brand-gray-500 hover:text-brand-gray-700',
          ]"
          @click="selectRole('USER')"
        >
          Owner
        </button>
        <button
          type="button"
          :class="[
            'flex-1 py-2 rounded-full text-base font-bold transition-all duration-400',
            selectedRole === 'SITTER'
              ? 'bg-brand-white text-brand-orange-700 shadow-sm'
              : 'text-brand-gray-500 hover:text-brand-gray-700',
          ]"
          @click="selectRole('SITTER')"
        >
          Sitter
        </button>
      </div>

      <!-- General Error -->
      <div
        v-if="errors.general"
        class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
      >
        {{ errors.general }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block body-2 font-medium text-brand-black mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="email@company.com"
            autocomplete="email"
            @input="clearError('email')"
            :class="[
              'w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors',
              errors.email
                ? 'border-brand-red-500 focus:border-brand-red-500'
                : 'border-brand-gray-100 focus:border-brand-orange-700',
            ]"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-brand-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block body-2 font-medium text-brand-black mb-1"
            >Phone</label
          >
          <input
            v-model="phone"
            type="tel"
            placeholder="Your phone number"
            autocomplete="tel"
            @input="clearError('phone')"
            :class="[
              'w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors',
              errors.phone
                ? 'border-brand-red-500 focus:border-brand-red-500'
                : 'border-brand-gray-100 focus:border-brand-orange-700',
            ]"
          />
          <p v-if="errors.phone" class="mt-1 text-xs text-brand-red-500">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block body-2 font-medium text-brand-black mb-1"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create your password"
              autocomplete="new-password"
              @input="clearError('password')"
              :class="[
                'w-full px-4 py-3 pr-12 border rounded-lg text-sm outline-none transition-colors',
                errors.password
                  ? 'border-brand-red-500 focus:border-brand-red-500'
                  : 'border-brand-gray-100 focus:border-brand-orange-700',
              ]"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- Eye icon -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <!-- Eye-slash icon -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-brand-red-500">
            {{ errors.password }}
          </p>
          <p class="mt-1 text-xs text-brand-gray-500">Minimum 13 characters</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors text-sm mt-2"
        >
          <span v-if="isLoading">Registering…</span>
          <span v-else>{{ buttonLabel }}</span>
        </button>
      </form>

      <!-- Social login (UI only) -->
      <div class="mt-8 flex w-full flex-col items-center gap-6">
        <div class="flex w-full items-center gap-3">
          <div class="h-px flex-1 bg-brand-gray-100" aria-hidden="true" />
          <span
            class="shrink-0 text-sm font-medium text-brand-gray-500"
          >
            Or Continue With
          </span>
          <div class="h-px flex-1 bg-brand-gray-100" aria-hidden="true" />
        </div>
        <div class="flex w-full gap-4">
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gray-50 py-3 px-4 text-sm font-semibold text-brand-gray-900 transition-colors hover:bg-brand-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-700"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </button>
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gray-50 py-3 px-4 text-sm font-semibold text-brand-gray-900 transition-colors hover:bg-brand-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-700"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Gmail
          </button>
        </div>
      </div>

      <!-- Login link -->
      <p class="text-center font-bold body-2 text-brand-black mt-8">
        Already have an account?
        <router-link
          to="/login"
          class="text-brand-orange-700 font-bold hover:underline"
        >
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>
