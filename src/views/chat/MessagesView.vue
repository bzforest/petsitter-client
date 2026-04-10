<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import ChatListItem from '@/components/ui/ChatListItem.vue'
import ChatBubble from '@/components/ui/ChatBubble.vue'
import ChatInput from '@/components/ui/ChatInput.vue'
import { X, Home, User } from 'lucide-vue-next'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useRoute , useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/axios'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

//  สร้างตัวแปรไว้จับกล่องแชท
const chatContainer = ref<HTMLElement | null>(null)

// รายชื่อคนคุย
const chats = ref<any[]>([])

const activeChatId = ref<number>(0)
const currentInput = ref('')
const activeMessages = ref<any[]>([])

// computed ดึงข้อมูลของคนที่กำลังคุยด้วย
const activeUser = computed(() => {
  return chats.value.find(c => c.id === activeChatId.value)
})

const fetchInbox = async () => {
  try {
    const { data } = await apiClient.get(`/api/messages/inbox?userId=${authStore.userId}`)
    
    // แปลงชื่อตัวแปรจาก Backend (ที่มี _ ) ให้ตรงกับที่หน้าเว็บเราใช้
    chats.value = data.map((c: any) => ({
      id: c.partner_id,
      name: c.partner_name,
      avatarUrl: c.partner_avatar,
      lastMessage: c.last_message,
      unreadCount: c.unread_count
    }))

    // 🟢 ตรวจสอบว่ามีใครหิ้ว ID ข้ามหน้ามาจากปุ่ม Message ไหม?
    const newChatIdParam = route.query.newChat;
    if (newChatIdParam) {
      const targetId = Number(newChatIdParam);
      const passedName = route.query.chatName as string;
      const passedAvatar = route.query.chatAvatar as string;
      const existingChat = chats.value.find(c => c.id === targetId);

      // ถ้าคนนี้ยังไม่เคยคุยกัน (ไม่มีใน Inbox) ให้โชว์ชื่อจำลองขึ้นมาบนสุดก่อน
      if (!existingChat) {
        chats.value.unshift({
          id: targetId,
          name: passedName || "Sitter (ID: " + targetId + ")",
          avatarUrl: passedAvatar || `https://ui-avatars.com/api/?name=Sitter+${targetId}&background=F3F4F6&color=374151`,
          lastMessage: "Start messaging...",
          unreadCount: 0
        });
      }
      selectChat(targetId); // สั่งเปิดห้องแชทคนนั้นทันที
      router.replace({ query: {} }) // ล้าง URL ให้สะอาด
    }

  } catch (error) {
    console.error("Failed to fetch inbox:", error)
  }
}

//  ฟังก์ชันดึงประวัติแชทจาก Backend
const fetchChatHistory = async (receiverId: number) => {
  try {
    const { data } = await apiClient.get(`/api/messages/history?user1=${authStore.userId}&user2=${receiverId}`)
    activeMessages.value = data
    scrollToBottom()
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
  }
}

// Actions: เมื่อคลิกเลือกคนคุย
const selectChat = async (id: number) => {
  activeChatId.value = id
  fetchChatHistory(id)

  //  เคลียร์จุดส้มฝั่งซ้ายบนหน้าจอให้หายไปทันที (หลอกตาให้ดูไวปรู๊ดปร๊าด)
  const chat = chats.value.find(c => c.id === id);
  if (chat) {
    chat.unreadCount = 0;
  }

  // ยิง API ไปอัปเดต Database ว่าอ่านแล้วนะ (เข้ามารอบหน้าจะได้ไม่เด้งอีก)
  try {
    await apiClient.patch(`/api/messages/read?userId=${authStore.userId}&partnerId=${id}`);
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
}

//  ทำหน้าที่รับจบทั้งอัปโหลดรูปและส่งข้อความ
const handleChatSubmit = async (text: string, file: File | null) => {
  let uploadedImageUrl: string | null = null;

  // 1. ถ้ามีรูปแนบมาด้วย ให้อัปโหลดขึ้น Supabase ก่อน!
  if (file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `chat/${fileName}`

      const { error } = await supabase.storage.from('chat-images').upload(filePath, file)
      if (error) throw error

      const { data: urlData } = supabase.storage.from('chat-images').getPublicUrl(filePath)
      uploadedImageUrl = urlData.publicUrl; // เก็บ URL ที่ได้ไว้ส่งต่อ
    } catch (error) {
      console.error("Upload error:", error)
      alert("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
      return; // ถ้าอัปโหลดพัง ให้หยุดการส่งข้อความเลย
    }
  }

  // 2. ส่งข้อความ (และ/หรือ) URL รูปภาพ เข้าสู่ระบบแชทปกติ
  await sendMessage(text, uploadedImageUrl);
}

// Actions: เมื่อกดส่งข้อความ
const sendMessage = async (text: string | null = null, imageUrl: string | null = null) => {
  if (!activeChatId.value || (!text?.trim() && !imageUrl)) return

  const payload = {
    sender_id: authStore.userId,
    receiver_id: activeChatId.value,
    content: text?.trim() || '', // ถ้าส่งแค่รูป content จะเป็นช่องว่าง
    image_url: imageUrl // URL ที่ได้จาก Supabase
  }

  // เทคนิค Optimistic UI: เอาข้อความมาแปะโชว์ที่หน้าจอเราก่อนเลย ให้ดูเหมือนส่งเร็วปรู๊ดปร๊าด
  const tempMsg = {
    id: Date.now(),
    sender_id: authStore.userId,
    receiver_id: activeChatId.value,
    content: text?.trim() || '',
    image_url: imageUrl,
    created_at: new Date().toISOString()
  }

  activeMessages.value.push(tempMsg)
  currentInput.value = '' // ล้างช่องพิมพ์
  scrollToBottom()

  // ยิง API ไปเซฟลง Database เบื้องหลัง
  try {
    await apiClient.post(`/api/messages`, payload)
  } catch (error) {
    console.error("Failed to send message:", error)
    alert("ส่งข้อความไม่สำเร็จ")
  }
  // TODO: ทำให้ Scroll เด้งลงล่างสุด (เดี๋ยวมาทำทีหลัง)
}

let stompClient: Client | null = null;

const connectWebSocket = () => {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  // สร้างตัวเชื่อมต่อ STOMP
  stompClient = new Client({
    // เปลี่ยน URL ให้ตรงกับ Backend ของคุณเบสท์ (ปกติคือพอร์ต 8080)
    webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
    debug: (str) => { console.log(str) }, // เอาไว้ดู Log ใน Console
    
    // เมื่อเชื่อมต่อสำเร็จ
    onConnect: () => {
      console.log('🔥 Connected to WebSocket!');
      
      // 🟢 ไปยืนรอฟัง (Subscribe) ที่ช่องทางของตัวเอง
      stompClient?.subscribe(`/topic/messages/${authStore.userId}`, (message) => {
        const newMsg = JSON.parse(message.body);
        console.log("📬 Got new real-time message: ", newMsg);

        // ถ้าข้อความที่เด้งมา เป็นของคนที่เรากำลังเปิดแชทคุยอยู่พอดี ให้ดันเข้าหน้าจอเลย!
        if (newMsg.sender_id === activeChatId.value) {
          activeMessages.value.push(newMsg);
          scrollToBottom()
        } else {
          console.log("Message from someone else, updating unread count...");
        }
      });
    },
    
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    }
  });

  stompClient.activate(); // เริ่มการเชื่อมต่อ!
}

// เมื่อเปิดหน้านี้ขึ้นมา ให้ทำงาน 2 อย่าง
onMounted(() => {
  connectWebSocket(); // 1. ต่อท่อ Real-time
  fetchInbox();       // 2. ดึงรายชื่อ (จัดการเรื่อง newChat ให้เสร็จสรรพในนี้แล้ว)
})

// เมื่อออกจากหน้านี้ ให้ปิดท่อประหยัดทรัพยากร
onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('🛑 Disconnected from WebSocket');
  }
})

// สำหรับเลื่อนจอลงล่างสุด
const scrollToBottom = async () => {
  await nextTick(); // รอให้ Vue วาดกล่องข้อความใหม่บนจอให้เสร็จก่อน
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

</script>

<template>
    <div class="h-screen w-full flex overflow-hidden bg-white">
      
      <aside class="w-full md:w-[350px] lg:w-[400px] h-full bg-[#111111] flex flex-col shrink-0" :class="{ 'hidden md:flex': activeChatId }">
        <div class="p-6 flex items-center justify-between shrink-0">
          <h2 class="text-white headline-3">Messages</h2>
          
          <div class="flex items-center gap-3">
            <button @click="router.push('/')" 
                    class="w-10 h-10 rounded-full bg-brand-white flex items-center justify-center text-brand-gray-400 hover:text-white hover:bg-brand-orange-500 transition cursor-pointer"
                    title="Back to Home">
              <Home class="w-5 h-5" />
            </button>
            
            <button @click="router.push('/account/profile')" 
                    class="w-10 h-10 rounded-full bg-brand-white flex items-center justify-center text-brand-gray-400 hover:text-white hover:bg-brand-orange-500 transition cursor-pointer"
                    title="My Profile">
              <User class="w-5 h-5" />
            </button>
          </div>
        </div>
  
        <div class="flex-1 overflow-y-auto">
          <ChatListItem
            v-for="chat in chats"
            :key="chat.id"
            :name="chat.name"
            :avatarUrl="chat.avatarUrl"
            :unreadCount="chat.unreadCount"
            :lastMessage="chat.lastMessage" :isActive="activeChatId === chat.id"
            @click="selectChat(chat.id)"
          />
        </div>
      </aside>
  
      <main class="flex-1 bg-white flex flex-col h-full w-full relative" :class="{ 'hidden md:flex': !activeChatId }">
        
        <div v-if="!activeUser" class="flex-1 flex flex-col items-center justify-center text-brand-gray-400 h-full">
          <p class="body-1 mt-4">Select a conversation to start messaging</p>
        </div>
  
        <div v-else class="flex-1 flex flex-col h-full w-full">
          
          <div class="h-[88px] shrink-0 border-b border-brand-gray-100 flex items-center justify-between px-8 bg-white shadow-sm z-10">
            <div class="flex items-center gap-4">
              <button class="md:hidden p-2 -ml-2 text-brand-gray-500" @click="activeChatId = 0">
                <span class="text-2xl">←</span>
              </button>
              <img :src="activeUser.avatarUrl" alt="" class="w-12 h-12 rounded-full object-cover">
              <h3 class="headline-4 text-brand-black">{{ activeUser.name }}</h3>
            </div>
            <button @click="activeChatId = 0" class="p-2 text-brand-gray-400 hover:text-brand-gray-600 transition cursor-pointer hover:scale-105">
               <X class="w-6 h-6"/>
            </button>
          </div>
  
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-white">
            <ChatBubble
              v-for="msg in activeMessages"
              :key="msg.id"
              :is-sender="msg.sender_id === authStore.userId" 
              :message="msg.content" 
              :image-url="msg.image_url"
              :avatar-url="msg.sender_id === authStore.userId ? '' : activeUser.avatarUrl"
            />
          
            <div v-if="activeMessages.length === 0" class="flex flex-col items-center justify-center h-full text-brand-gray-400">
              <p>Start a conversation with {{ activeUser.name }}!</p>
            </div>
          </div>
  
          <div class="shrink-0 w-full bg-white pb-4 px-4">
            <ChatInput
              v-model="currentInput"
              @send="handleChatSubmit"  />
          </div>
  
        </div>
      </main>
    
    </div>
  </template>