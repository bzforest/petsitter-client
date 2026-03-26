import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css' // ไฟล์ที่เรารวม Tailwind ไว้

const app = createApp(App)

app.use(createPinia()) // เปิดใช้งาน State Management
app.use(router)        // เปิดใช้งานระบบ Routing

app.mount('#app')