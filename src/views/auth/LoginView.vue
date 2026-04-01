<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errors = ref<{ email?: string; password?: string; general?: string }>({});

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = undefined;
}

function parseApiErrors(err: unknown) {
  const data = (err as any)?.response?.data;
  if (!data) {
    errors.value.general = "Something went wrong. Please try again.";
    return;
  }
  if (typeof data === "string") {
    errors.value.general = data;
    return;
  }
  if (data.errors && Array.isArray(data.errors)) {
    data.errors.forEach((e: { field: string; message: string }) => {
      if (["email", "password"].includes(e.field)) {
        (errors.value as Record<string, string>)[e.field] = e.message;
      }
    });
    return;
  }
  errors.value.general =
    data.message ?? "Login failed. Please check your credentials.";
}

async function handleSubmit() {
  errors.value = {};
  isLoading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    await router.push(authStore.getDashboardRoute());
  } catch (err) {
    parseApiErrors(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p class="text-gray-500 text-base">Log in to your PetSitter account</p>
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
          <label class="block text-sm font-medium text-gray-800 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="email@company.com"
            autocomplete="email"
            @input="clearError('email')"
            :class="[
              'w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors',
              errors.email
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-400',
            ]"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-800 mb-1"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Your password"
              autocomplete="current-password"
              @input="clearError('password')"
              :class="[
                'w-full px-4 py-3 pr-12 border rounded-xl text-sm outline-none transition-colors',
                errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-200 focus:border-orange-400',
              ]"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
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
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors text-sm mt-2"
        >
          <span v-if="isLoading">Logging in…</span>
          <span v-else>Log In</span>
        </button>
      </form>

      <!-- Register link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <router-link
          to="/register"
          class="text-orange-500 font-medium hover:underline"
        >
          Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>
