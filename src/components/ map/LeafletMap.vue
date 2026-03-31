<template>
    <div ref="mapEl" class="w-full h-[200px] rounded-xl"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from "vue";
  import L from "leaflet";
  
  const mapEl = ref<HTMLDivElement | null>(null);
  
  // emit location กลับไปหน้า Profile
  const emit = defineEmits(["select"]);
  
  onMounted(() => {
    if (!mapEl.value) return;
  
    const map = L.map(mapEl.value).setView([13.7563, 100.5018], 13); // Bangkok
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
  
    let marker: any;
  
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
  
      if (marker) {
        map.removeLayer(marker);
      }
  
      marker = L.marker([lat, lng]).addTo(map);
  
      // ส่งค่าออกไป
      emit("select", { lat, lng });
    });
  });
  </script>