<script setup lang="ts">
import { computed } from 'vue';
import { Star } from 'lucide-vue-next';
import Badge from './Badge.vue';

interface Tag {
  label: string;
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'red' | 'gray';
}

interface Props {
  version?: 'Desktop' | 'Mobile';
  image: string;
  title: string;
  owner: string;
  rating: number;
  tags?: Tag[];
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  version: 'Desktop',
  selected: false,
  tags: () => []
});

defineEmits(['click']);

const cardClasses = computed(() => {
  const base = "bg-white overflow-hidden transition-all duration-300 border cursor-pointer";
  const layout = props.version === 'Mobile' 
    ? "flex flex-col w-[330px] p-4 rounded-2xl gap-2 shadow-sm" // Increased padding for beauty
    : "flex flex-row w-[471px] h-[138px] p-4 rounded-2xl gap-4 shadow-sm items-center";
  
  const state = props.selected 
    ? "border-brand-orange-300 shadow-md ring-1 ring-brand-orange-300"
    : "border-brand-gray-100 hover:border-brand-orange-300";

  return `${base} ${layout} ${state}`;
});

const imageClasses = computed(() => {
  return props.version === 'Mobile'
    ? "w-[120px] h-[80px] rounded-xl object-cover"
    : "w-[130px] h-full rounded-xl object-cover shrink-0";
});
</script>

<template>
  <div :class="cardClasses" @click="$emit('click')">
    <!-- LAYOUT DESKTOP -->
    <template v-if="version === 'Desktop'">
      <!-- IMAGE -->
      <img :src="image" :class="imageClasses" alt="Pet Place" />
      
      <!-- CONTENT -->
      <div class="flex flex-col grow h-full justify-between py-1">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <h3 class="headline-4 text-brand-gray-900 leading-tight">{{ title }}</h3>
            <p class="body-3 text-brand-gray-700 font-bold mt-1">By {{ owner }}</p>
          </div>
          <div class="flex items-center gap-0.5">
            <Star v-for="i in 5" :key="i" :size="14"
              :fill="i <= rating ? '#1CCD83' : '#AEB1C3'"
              :color="i <= rating ? '#1CCD83' : '#AEB1C3'"
            />
          </div>
        </div>
        
        <!-- TAGS -->
        <div class="flex flex-wrap gap-1 mt-auto pb-1">
          <Badge v-for="tag in tags" :key="tag.label" :label="tag.label" :color="tag.color" variant="pill" />
        </div>
      </div>
    </template>

    <!-- LAYOUT MOBILE -->
    <template v-else>
      <!-- Top Row: Image and Title Info -->
      <div class="flex gap-4 items-start">
        <img :src="image" :class="imageClasses" alt="Pet Place" />
        <div class="flex flex-col pt-1">
          <h3 class="headline-4 text-brand-gray-900 leading-tight">{{ title }}</h3>
          <p class="body-3 text-brand-gray-700 font-bold mt-1">By {{ owner }}</p>
        </div>
      </div>

      <!-- Rating Stars Row -->
      <div class="flex items-center gap-0.5 mt-1 ml-[136px]"> <!-- Offset slightly to align with text if desired, or keep left -->
        <Star v-for="i in 5" :key="i" :size="14"
          :fill="i <= rating ? '#1CCD83' : '#AEB1C3'"
          :color="i <= rating ? '#1CCD83' : '#AEB1C3'"
        />
      </div>

      <!-- Tags Row (Full Width below) -->
      <div class="flex flex-wrap gap-2 mt-2">
        <Badge v-for="tag in tags" :key="tag.label" :label="tag.label" :color="tag.color" variant="pill" />
      </div>
    </template>
  </div>
</template>
