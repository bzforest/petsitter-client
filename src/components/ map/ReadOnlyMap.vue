<template>
  <div ref="mapEl" class="w-full h-[280px] rounded-xl overflow-hidden z-0"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// แก้ปัญหา Vite bundle Leaflet default icon ไม่ถูก
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const props = defineProps<{
  lat: number;
  lng: number;
}>();

const mapEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!mapEl.value) return;

  const map = L.map(mapEl.value, {
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: false,
  }).setView([props.lat, props.lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([props.lat, props.lng]).addTo(map);

  watch(
    () => [props.lat, props.lng],
    ([newLat, newLng]) => {
      marker.setLatLng([newLat, newLng]);
      map.setView([newLat, newLng], 15);
    },
  );
});
</script>
