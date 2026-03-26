import { createRouter, createWebHistory } from 'vue-router'
// เดี๋ยวเราค่อยมา import หน้า views ต่างๆ ทีหลัง

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/', // เมื่อเข้า URL หลัก (localhost:5173)
        name: 'design-system',
        component: () => import('../views/DesignSystem.vue') // ให้ดึงไฟล์นี้มาแสดง
      }
    ]
  })
  
  export default router