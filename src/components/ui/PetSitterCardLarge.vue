<script setup lang="ts">
import { computed } from 'vue';
import { MapPin, Star } from 'lucide-vue-next';
import Badge from './Badge.vue';

interface Tag {
  label: string;
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'red' | 'gray';
}

interface Props {
  version?: 'desktop' | 'mb';
  image: string;
  avatar: string;
  title: string;
  owner: string;
  location: string;
  rating: number;
  tags?: Tag[];
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  version: 'desktop',
  selected: false,
  tags: () => []
});

defineEmits(['click']);

const cardClasses = computed(() => {
  const base = "bg-white overflow-hidden transition-all duration-300 border cursor-pointer";
  const layout = props.version === 'mb' 
    ? "flex flex-col w-[335px] min-h-[268px] p-4 rounded-2xl gap-4" 
    : "flex flex-row w-[848px] h-[216px] p-4 rounded-2xl items-center gap-10";
  
  const state = props.selected 
    ? "border-2 border-brand-orange-500"
    : "border border-brand-gray-100 hover:border-brand-orange-300";

  return `${base} ${layout} ${state}`;
});

const imageContainerClasses = computed(() => {
  return props.version === 'mb'
    ? "w-full h-[140px] flex-shrink-0"
    : "w-[240px] h-full flex-shrink-0";
});

const contentClasses = computed(() => {
  return props.version === 'mb'
    ? "flex flex-col gap-4 flex-grow"
    : "flex-grow flex flex-col justify-between h-full py-1";
});
</script>

<template>
  <div :class="cardClasses" @click="$emit('click')">
    <!-- HERO IMAGE -->
    <div :class="imageContainerClasses">
      <img 
        :src="image" 
        class="w-full h-full object-cover rounded-xl" 
        alt="Pet Sitter Place"
      />
    </div>

    <!-- CONTENT AREA -->
    <div :class="contentClasses">
      <!-- Header Row (Avatar + Title + Rating) -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <img 
            :src="avatar" 
            class="rounded-full border border-brand-gray-50 object-cover flex-shrink-0" 
            :class="version === 'mb' ? 'w-10 h-10' : 'w-12 h-12'"
            alt="Owner Avatar"
          />
          <div class="flex flex-col">
            <h3 :class="version === 'mb' ? 'headline-4' : 'headline-3'" class="text-brand-gray-900 leading-tight">
              {{ title }}
            </h3>
            <p class="body-2 text-brand-gray-700 font-bold" :class="version === 'mb' ? 'body-3' : 'body-2'">
              By {{ owner }}
            </p>
          </div>
        </div>
        
        <!-- Rating Stars -->
        <div class="flex items-center gap-0.5 pt-1">
          <Star 
            v-for="i in 5" 
            :key="i"
            :size="version === 'mb' ? 14 : 18"
            :fill="i <= rating ? '#1CCD83' : '#AEB1C3'"
            :color="i <= rating ? '#1CCD83' : '#AEB1C3'"
          />
        </div>
      </div>

      <!-- LOCATION -->
      <div class="flex items-center gap-2 text-brand-gray-300">
        <MapPin :size="16" />
        <span class="body-3 font-medium">{{ location }}</span>
      </div>

      <!-- TAGS -->
      <div class="flex flex-wrap gap-2">
        <Badge 
          v-for="tag in tags" 
          :key="tag.label" 
          :label="tag.label" 
          :color="tag.color" 
          variant="pill" 
        />
      </div>
    </div>
  </div>
</template>
