import { createRouter, createWebHistory } from "vue-router";
// เดี๋ยวเราค่อยมา import หน้า views ต่างๆ ทีหลัง

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", // เมื่อเข้า URL หลัก (localhost:5173)
      name: "design-system",
      component: () => import("../views/DesignSystem.vue"), // ให้ดึงไฟล์นี้มาแสดง
    },
    // Jab เพิ่มมาทดสอบการทำงาน Navigation bar ลบออกเมื่อมี authentication
    {
      path: "/register",
      component: () => import("@/views/DesignSystem.vue"),
    },
    {
      path: "/login",
      component: () => import("@/views/DesignSystem.vue"),
    },
    {
      path: "/find-sitter",
      component: () => import("@/views/DesignSystem.vue"),
    },
    {
      path: "/profile",
      component: () => import("@/views/DesignSystem.vue"),
    },
    {
      path: "/your-pet",
      component: () => import("@/views/DesignSystem.vue"),
    },
    {
      path: "/history",
      component: () => import("@/views/DesignSystem.vue"),
    },
  ],
});

export default router;
