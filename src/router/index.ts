import { createRouter, createWebHistory } from 'vue-router'
// เดี๋ยวเราค่อยมา import หน้า views ต่างๆ ทีหลัง

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ตัวอย่างการตั้งค่า Route หน้า Landing Page
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../views/HomeView.vue')
    // }
  ]
})

export default router