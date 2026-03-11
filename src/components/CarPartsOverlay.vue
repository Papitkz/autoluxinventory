<template>
  <div 
    class="absolute inset-0 bg-black/95 backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden"
    :class="{ 'opacity-100': forceShow }"
  >
    <!-- Background grid -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" 
           style="background-image: linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px;" />
    </div>

    <!-- Header -->
    <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
      <div>
        <span class="text-[10px] tracking-widest text-gray-500 uppercase block">Technical View</span>
        <h4 class="text-sm font-medium text-white">Component Gallery</h4>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="hasRealImages" class="text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <v-icon icon="mdi-check-circle" size="12" />
          {{ availableParts.length }} Photos
        </span>
        <button 
          v-if="forceShow"
          @click="$emit('close')"
          class="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <v-icon icon="mdi-close" size="14" />
        </button>
      </div>
    </div>

    <!-- Content: Real Images OR Fallback Diagram -->
    <div class="absolute inset-0 pt-16 pb-4 px-4">
      
      <!-- HAS REAL IMAGES: Grid Gallery -->
      <div v-if="hasRealImages" class="h-full overflow-y-auto hide-scrollbar">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="part in availableParts"
            :key="part.partId"
            class="relative aspect-square bg-gray-900 border border-white/10 overflow-hidden cursor-pointer group/part"
            @mouseenter="hoveredPart = part"
            @mouseleave="hoveredPart = null"
            @click="$emit('part-click', part)"
          >
            <img 
              :src="part.url" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover/part:scale-110"
              @error="$event.target.src = '/no-image.jpg'"
            />
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/part:opacity-100 transition-opacity">
              <div class="absolute bottom-0 left-0 right-0 p-2">
                <div class="flex items-center gap-1 mb-1">
                  <v-icon icon="mdi-camera" size="10" class="text-white" />
                  <span class="text-[10px] text-white uppercase tracking-wider font-medium truncate">{{ part.name }}</span>
                </div>
                <p v-if="part.description" class="text-[9px] text-gray-400 line-clamp-2 leading-tight">{{ part.description }}</p>
              </div>
            </div>
            <!-- Corner accent -->
            <div class="absolute top-0 right-0 w-6 h-6 border-l border-b border-white/20 bg-black/50 flex items-center justify-center opacity-0 group-hover/part:opacity-100 transition-opacity">
              <v-icon icon="mdi-arrow-top-right" size="10" class="text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- NO REAL IMAGES: Fallback Interactive Diagram -->
      <div v-else class="h-full flex items-center justify-center">
        <div class="relative w-full max-w-[300px] aspect-[4/3]">
          <!-- Simple car outline -->
          <svg 
            viewBox="0 0 300 150" 
            class="absolute inset-0 w-full h-full opacity-30"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <path 
              d="M30 100 Q30 75 50 70 L70 65 L90 40 Q110 30 200 30 L220 35 L260 45 Q280 50 280 75 L280 95 Q280 105 270 105 L260 105 Q250 120 230 120 Q210 120 200 105 L110 105 Q100 120 80 120 Q60 120 50 105 L40 105 Q30 105 30 100 Z" 
              class="text-white"
            />
            <circle cx="80" cy="105" r="18" class="text-white" />
            <circle cx="230" cy="105" r="18" class="text-white" />
          </svg>

          <!-- Generic hotspots -->
          <div
            v-for="part in genericParts"
            :key="part.id"
            class="absolute transform -translate-x-1/2 -translate-y-1/2"
            :style="{ top: part.position.top, left: part.position.left }"
          >
            <div class="w-3 h-3 bg-white/50 animate-ping absolute rounded-full" />
            <div class="w-2 h-2 bg-white relative z-10" />
          </div>

          <!-- Message -->
          <div class="absolute -bottom-8 left-0 right-0 text-center">
            <p class="text-[10px] text-gray-500 uppercase tracking-widest">No component photos available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Selected Part Detail (only for real images) -->
    <div v-if="hasRealImages && hoveredPart" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
      <div class="flex items-center gap-3 border-l-2 border-white pl-3">
        <div class="w-10 h-10 bg-gray-900 border border-white/20 overflow-hidden shrink-0">
          <img :src="hoveredPart.url" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0">
          <h5 class="text-xs font-medium text-white uppercase tracking-wider truncate">{{ hoveredPart.name }}</h5>
          <p class="text-[10px] text-gray-400 truncate">{{ hoveredPart.description || 'Click to view details' }}</p>
        </div>
        <v-icon icon="mdi-arrow-right" size="14" class="text-white ml-auto shrink-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PartImage {
  partId: string
  name: string
  url: string
  description?: string
}

const props = defineProps<{
  partImages?: PartImage[]
  category: string
  forceShow?: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'part-click', part: PartImage): void
}>()

const hoveredPart = ref<PartImage | null>(null)

// Check if we have real part images
const hasRealImages = computed(() => {
  return props.partImages && props.partImages.length > 0
})

// Available parts from uploaded images
const availableParts = computed(() => {
  return props.partImages || []
})

// Fallback generic parts for diagram
const genericParts = [
  { id: 'engine', position: { top: '45%', left: '30%' } },
  { id: 'wheels', position: { top: '75%', left: '25%' } },
  { id: 'interior', position: { top: '35%', left: '55%' } },
  { id: 'trunk', position: { top: '50%', left: '80%' } }
]
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>