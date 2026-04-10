<script setup lang="ts">
import ChatListItem from './ChatListItem.vue';
</script>

<template>
    <div class="pt-8">
        <h3 class="headline-3 text-brand-900 mb-6">7. Chat List</h3>

        <div class="bg-brand-black p-4 rounded-xl flex flex-col w-full max-w-[350px]">

            <ChatListItem 
                name="Jane Maison"
                lastMessage="You: hi"
                :unreadCount="1"
                :isActive="true"
            />

            <ChatListItem 
                name="Jane Maison"
                lastMessage="I love your cat!"
                :unreadCount="4"
                :isActive="false"
            />

            <ChatListItem 
                 name="Jane Maison"
                lastMessage="yeah my home is so big"
                :unreadCount="0"
                :isActive="false"
            />

        </div>
    </div>
</template>