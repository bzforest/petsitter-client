<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Button from "@/components/ui/Button.vue";
import IconBell from "@/components/icons/IconBell.vue";
import Chat from "@/components/icons/Chat.vue";
import Profile from "@/components/icons/Profile.vue";
import Paws from "@/components/icons/Paws.vue";
import History from "@/components/icons/History.vue";
import Logout from "@/components/icons/Logout.vue";
import HamburgerMenu from "@/components/icons/HamburgerMenu.vue";

// 🟢 1. Import Store และ Router เข้ามา
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import apiClient from '@/api/axios'

// 🟢 2. เรียกใช้งาน Store และ Router
const authStore = useAuthStore()
const router = useRouter()

// --- Custom Directive: ปิด dropdown เมื่อคลิกนอก element ---
const vClickOutside = {
  mounted(el: any, binding: { value: () => void }) {
    el._clickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value();
      }
    };
    document.addEventListener("click", el._clickOutside);
  },
  unmounted(el: any) {
    document.removeEventListener("click", el._clickOutside);
  },
};

// --- Dropdown & Mobile Menu ---
const showDropdown = ref(false);
const showMobileMenu = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

// 🟢 3. สร้างฟังก์ชัน Logout ของจริง
function handleLogout() {
  authStore.logout() // เคลียร์ Token และ State ใน Store
  showDropdown.value = false;
  router.push('/login') // เด้งกลับไปหน้า Login
}

const profileImage = ref("https://ui-avatars.com/api/?name=User&background=ffd5b4&color=ff6b00");

const loadProfileImage = async () => {
  if (authStore.isLoggedIn) {
    try {
      const { data } = await apiClient.get('/api/user-profiles/me')
      if (data.profile_image) {
        profileImage.value = data.profile_image
      }
    } catch (error) {
      console.error("Could not load profile image for navbar", error)
    }
  }
}

onMounted(() => {
  loadProfileImage()
})

watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) loadProfileImage()
})

const goToMessages = () => {
  router.push('/chat'); // ไปหน้าแชทเฉยๆ ไม่ต้องพก ID ไป
}
</script>

<template>
  <nav class="bg-brand-white shadow-sm sticky top-0 z-50 w-full">
    <div
      class="w-full mx-auto px-10 sm:px-20 h-20 flex items-center justify-between"
    >
      <!-- Logo -->
      <RouterLink to="/" class="shrink-0">
        <img
          src="@/assets/logo/petsitter-logo.svg"
          alt="Sitter-logo"
          class="h-8"
        />
      </RouterLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-10">
        <!-- ยังไม่ได้ Login -->
        <template v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/register"
            class="body-1 text-brand-black hover:text-brand-orange-700 transition sm:px-5"
          >
            Register
          </RouterLink>
          <RouterLink
            to="/login"
            class="body-1 text-brand-black hover:text-brand-orange-700 transition"
          >
            Login
          </RouterLink>
          <Button variant="primary" class="cursor-pointer" as="link" to="/find-sitter"
            >Find A Pet Sitter</Button
          >
        </template>

        <!-- Login แล้ว -->
        <template v-else>
          <div class="flex items-center gap-4">
            <!-- Notification Bell -->
            <button
              class="w-12 h-12 rounded-full flex items-center justify-center bg-brand-gray-50 hover:bg-brand-gray-100 transition"
            >
              <IconBell
                class="text-brand-gray-300 hover:text-brand-black transition cursor-pointer"
              />
            </button>
            <!-- Chat -->
            <button
              @click="goToMessages"
              class="w-12 h-12 rounded-full flex items-center justify-center bg-brand-gray-50 hover:bg-brand-gray-100 transition"
            >
              <Chat class="text-brand-gray-300 hover:text-black transition cursor-pointer" />
            </button>

            <!-- Avatar + Dropdown -->
            <div class="relative" v-click-outside="closeDropdown">
              <button
                @click="toggleDropdown"
                class="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-brand-orange-500 transition"
              >
                <img
                  :src="profileImage"
                  alt="User Profile"
                  class="w-full h-full object-cover cursor-pointer"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-from-class="opacity-0 -translate-y-2"
                enter-active-class="transition duration-150"
                leave-to-class="opacity-0 -translate-y-2"
                leave-active-class="transition duration-150"
              >
                <div
                  v-if="showDropdown"
                  class="absolute -right-4 top-14 w-48 bg-white rounded-xl shadow-lg py-2"
                >
                  <RouterLink
                    to="/account/profile"
                    @click="closeDropdown"
                    class="flex items-center gap-3 px-5 py-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
                  >
                    <Profile />
                    Profile
                  </RouterLink>

                  <RouterLink
                    to="/account/yourpet"
                    @click="closeDropdown"
                    class="flex items-center gap-3 px-5 py-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
                  >
                    <Paws />
                    Your Pet
                  </RouterLink>

                  <RouterLink
                    to="/account/bookings"
                    @click="closeDropdown"
                    class="flex items-center gap-3 px-5 py-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
                  >
                    <History />
                    History
                  </RouterLink>

                  <hr class="border-brand-gray-100 my-1" />

                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 px-5 py-3 body-2 text-brand-black hover:text-brand-gray-500 transition cursor-pointer"
                  >
                    <Logout />
                    Log out
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Find A Pet Sitter -->
          <Button variant="primary" as="link" to="/find-sitter" class="cursor-pointer"
            >Find A Pet Sitter</Button
          >
        </template>
      </div>

      <!-- Mobile Hamburger -->
      <button
        class="md:hidden text-brand-gray-500 flex items-center justify-center"
        @click="showMobileMenu = !showMobileMenu"
      >
        <HamburgerMenu />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-from-class="opacity-0 -translate-y-2"
      enter-active-class="transition duration-150"
      leave-to-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
    >
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-white border-t border-brand-gray-100 px-6 py-4 space-y-3"
      >
        <template v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/register"
            class="block body-2 text-brand-black hover:text-brand-orange-700 transition py-2"
            @click="showMobileMenu = false"
            >Register
          </RouterLink>
          <RouterLink
            to="/login"
            class="block body-2 text-brand-black hover:text-brand-orange-700 transition py-2"
            >Login
          </RouterLink>
        </template>
        <template v-else>
          <div class="flex flex-col gap-5 mb-7">
            <RouterLink
              to="/account/profile"
              @click="showMobileMenu = false"
              class="flex items-center gap-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
            >
              <Profile />
              Profile
            </RouterLink>
            <RouterLink
              to="/account/yourpet"
              class="flex items-center gap-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
              @click="showMobileMenu = false"
            >
              <Paws />
              Your Pet
            </RouterLink>
            <RouterLink
              to="/account/bookings"
              class="flex items-center gap-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
              @click="showMobileMenu = false"
            >
              <History />
              History
            </RouterLink>
            <hr class="border-brand-gray-100 my-1 -mx-10" />
            <button
              @click="handleLogout"
              class="flex items-center gap-3 body-2 text-brand-black hover:text-brand-gray-500 transition"
            >
              <Logout />
              Log out
            </button>
          </div>
        </template>
        <RouterLink
          to="/find-sitter"
          class="w-full"
        >
          <Button variant="primary" class="w-full cursor-pointer">Find A Pet Sitter</Button>
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>
