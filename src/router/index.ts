import { createRouter, createWebHistory } from "vue-router";
import SitterLayout from "@/components/layout/SitterLayout.vue";

import { useAuthStore, type Role } from '@/stores/auth'

// Define the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public home route
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },

    {
      path: "/sitterprofile",
      name: "sitterprofile",
      component: SitterLayout,
      children: [
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/Profile.vue"),
        },
      ],

    },
    // Public auth routes
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },

    // Protected dashboard routes
    // TEST ONLY
    // TODO: Remove this after testing
    {
      path: '/dashboard/owner',
      name: 'dashboard-owner',
      component: () => import('@/views/dashboard/OwnerDashboard.vue'),
      meta: { requiresAuth: true, roles: ['USER'] },
    },
    {
      path: '/dashboard/sitter',
      name: 'dashboard-sitter',
      component: () => import('@/views/dashboard/SitterDashboard.vue'),
      meta: { requiresAuth: true, roles: ['SITTER'] },
    },
    {
      path: '/dashboard/admin',
      name: 'dashboard-admin',
      component: () => import('@/views/dashboard/AdminDashboard.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },

    // Existing routes (keep for nav testing)
    {
      path: '/find-sitter',
      component: () => import('@/views/DesignSystem.vue'),
    },
    {
      path: '/profile',
      component: () => import('@/views/DesignSystem.vue'),
    },
    {
      path: '/sitter/:id',
      name: 'sitter-detail',
      component: () => import('@/views/sitter/SitterDetailView.vue'),
    },
    {
      path: '/sitter/:id/booking',
      name: 'booking',
      component: () => import('@/views/booking/BookingView.vue'),
      meta: { requiresAuth: true, roles: ['USER', 'SITTER'] }
    },
    {
      path: '/booking-success/:id',
      name: 'booking-success',
      component: () => import('@/views/booking/BookingSuccessView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/your-pet',
      name: 'your-pet',
      component: () => import('@/views/pet/YourPetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      component: () => import('@/views/DesignSystem.vue'),
    },
    {
      path: '/design',
      name: 'design',
      component: () => import('@/views/DesignSystem.vue'),
    },

    // Fallback
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
    {
      path: "/Search",
      name: "SearchMap",
      component: () => import("@/views/Search.vue"),
    },
    {
      path: "/pet-sitter-detail",
      name: "PetSitterDetail",
      component: () => import("@/views/PetSitterDetail.vue"),
    },
  ],
})

// Navigation guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Logged-in user tries to access guest-only pages → redirect to their dashboard
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return auth.getDashboardRoute()
  }

  // Not logged in trying to access protected route → redirect to login
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }

  // Logged in but wrong role for the route
  if (to.meta.requiresAuth && to.meta.roles) {
    const allowedRoles = to.meta.roles as Role[]
    if (!auth.role || !allowedRoles.includes(auth.role)) {
      return auth.getDashboardRoute()
    }
  }
})

export default router
