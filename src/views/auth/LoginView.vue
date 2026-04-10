<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import GoogleRoleModal from "@/components/auth/GoogleRoleModal.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const isGoogleLoading = ref(false);
const showRoleModal = ref(false);
const errors = ref<{ email?: string; password?: string; general?: string }>({});

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = undefined;
}

const passwordRealtimeError = computed((): string => {
  if (!password.value) return "";
  if (password.value.length < 13)
    return `Password must be at least 13 characters (currently ${password.value.length})`;
  return "";
});

const passwordInputClass = computed(() => {
  const base =
    "w-full px-4 py-3 pr-12 border rounded-lg text-sm outline-none transition-colors";
  if (errors.value.password || passwordRealtimeError.value)
    return `${base} border-red-600 focus:border-red-600`;
  if (!password.value)
    return `${base} border-brand-gray-100 focus:border-brand-orange-700`;
  return `${base} border-orange-500 focus:border-orange-500`;
});

function validate(): boolean {
  errors.value = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value.trim()) {
    errors.value.email = "Email is required";
  } else if (!emailRegex.test(email.value.trim())) {
    errors.value.email = "Invalid email format, e.g. example@email.com";
  }

  if (!password.value) {
    errors.value.password = "Password is required";
  } else if (password.value.length < 13) {
    errors.value.password = `Password must be at least 13 characters (currently ${password.value.length})`;
  }

  return Object.keys(errors.value).length === 0;
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
  if (!validate()) return;
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

// เปิด modal ให้เลือก role ก่อน redirect ไป Google
function handleGoogleLogin() {
  errors.value = {};
  showRoleModal.value = true;
}

// user เลือก role แล้วกด confirm ใน modal
async function onRoleConfirmed(role: "USER" | "SITTER") {
  isGoogleLoading.value = true;
  try {
    await authStore.loginWithGoogle(role);
    // browser จะ redirect ออกไปหน้า Google — ไม่มีโค้ดทำงานต่อจากนี้
  } catch (err) {
    errors.value.general = "Unable to connect to Google. Please try again.";
    showRoleModal.value = false;
    isGoogleLoading.value = false;
  }
}
</script>

<template>
  <div
    class="relative min-h-screen bg-brand-white flex items-center justify-center px-4 overflow-hidden"
  >
    <!-- Yellow paw — top-right corner, partially off-screen -->
    <img
      src="@/assets/Element Design/yellowpaw.svg"
      alt=""
      aria-hidden="true"
      class="absolute top-10 -right-3 w-60 pointer-events-none select-none"
    />

    <!-- Green asterisk — bottom-left corner, partially off-screen -->
    <img
      src="@/assets/Element Design/greenasterisk.svg"
      alt=""
      aria-hidden="true"
      class="absolute -bottom-3 left-0 w-60 pointer-events-none select-none"
    />

    <div class="w-full max-w-md bg-brand-white p-5">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="headline-1 font-bold text-brand-black mb-2">
          Welcome Back!
        </h1>
        <p class="text-brand-gray-500 headline-4 font-bold">
          Find your perfect pet sitter with us
        </p>
      </div>

      <!-- General Error -->
      <div
        v-if="errors.general"
        class="mb-4 rounded-lg bg-brand-red-500 border border-brand-red-200 px-4 py-3 text-sm text-brand-red-600"
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

        <!-- Password -->
        <div>
          <label class="block body-2 font-medium text-brand-black mb-1"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Your password"
              autocomplete="current-password"
              @input="clearError('password')"
              :class="passwordInputClass"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
          <p
            v-if="errors.password || passwordRealtimeError"
            class="mt-1 text-xs text-red-600"
          >
            {{ errors.password || passwordRealtimeError }}
          </p>
        </div>

        <!-- Remember + Forget (UI only) -->
        <div class="flex items-center justify-between pt-1">
          <label
            class="inline-flex items-center gap-2 text-brand-gray-700 body-2 select-none cursor-pointer"
          >
            <input v-model="rememberMe" type="checkbox" class="peer sr-only" />
            <span
              :class="[
                'grid h-6 w-6 place-items-center rounded-lg border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-orange-700',
                rememberMe
                  ? 'border-brand-orange-700 bg-brand-orange-700'
                  : 'border-brand-gray-100 bg-brand-white',
              ]"
            >
              <svg
                v-if="rememberMe"
                class="h-3.5 w-3.5 text-brand-white"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 10.5L8.25 13.75L15 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Remember me?</span>
          </label>

          <button
            type="button"
            class="body-2 font-semibold cursor-pointer text-brand-orange-700 hover:text-brand-orange-900 transition-colors"
          >
            Forget Password?
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
        >
          <div
            v-if="isLoading"
            class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"
          />
          <span>{{ isLoading ? 'Logging in…' : 'Log In' }}</span>
        </button>
      </form>

      <!-- Social login (UI only) -->
      <div class="mt-8 flex w-full flex-col items-center gap-6">
        <div class="flex w-full items-center gap-3">
          <div class="h-px flex-1 bg-gray-200" aria-hidden="true" />
          <span class="shrink-0 text-sm font-medium text-gray-500">
            Or Continue With
          </span>
          <div class="h-px flex-1 bg-gray-200" aria-hidden="true" />
        </div>
        <div class="flex w-full gap-4">
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-100 py-3 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer"
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
            @click="handleGoogleLogin"
            :disabled="isGoogleLoading || isLoading"
            class="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-100 py-3 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer"
          >
            <svg
              v-if="!isGoogleLoading"
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
            <div
              v-else
              class="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin shrink-0"
            />
            {{ isGoogleLoading ? "Redirecting..." : "Gmail" }}
          </button>
        </div>
      </div>

      <!-- Register link -->
      <p class="text-center font-bold body-2 text-brand-black mt-8">
        Don't have any account?
        <router-link
          to="/register"
          class="text-brand-orange-700 font-bold hover:underline"
        >
          Register
        </router-link>
      </p>
    </div>
  </div>

  <!-- Role selection modal — แสดงก่อน redirect ไป Google -->
  <GoogleRoleModal
    v-if="showRoleModal"
    :is-loading="isGoogleLoading"
    @confirm="onRoleConfirmed"
    @cancel="showRoleModal = false"
  />
</template>
