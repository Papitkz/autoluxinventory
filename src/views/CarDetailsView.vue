<!-- CarDetailsView.vue - Responsive Version -->
<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-12 lg:pb-20">
    
    <!-- Loading State -->
    <div v-if="carsStore.loading" class="flex justify-center items-center min-h-[60vh]">
      <div class="relative">
        <div class="w-10 h-10 lg:w-12 lg:h-12 border border-white/20 border-t-white animate-spin" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="carsStore.error" class="flex justify-center items-center min-h-[60vh] px-4">
      <div class="border border-white/10 p-8 lg:p-16 text-center max-w-lg">
        <div class="w-16 h-16 lg:w-20 lg:h-20 border border-red-500/30 flex items-center justify-center mx-auto mb-4 lg:mb-6">
          <v-icon icon="mdi-alert-octagon" size="32" lg="size-40" class="text-red-400" />
        </div>
        <h2 class="text-2xl lg:text-3xl font-light mb-3 tracking-tight">Vehicle Unavailable</h2>
        <p class="text-gray-500 text-sm mb-6 lg:mb-8 font-light">{{ carsStore.error }}</p>
        <router-link 
          to="/cars" 
          class="inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium"
        >
          <v-icon icon="mdi-arrow-left" size="16" />
          Back to Inventory
        </router-link>
      </div>
    </div>

    <!-- Car Details -->
    <div v-else-if="car" class="fade-in">
      
      <!-- Hero Section - Mobile Optimized -->
      <header class="border-b border-white/10 bg-gradient-to-r from-red-950/20 via-black to-black relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <!-- Breadcrumb -->
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-6 relative">
          <div class="flex items-center gap-2 text-[10px] sm:text-xs tracking-widest text-gray-500 uppercase overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 hide-scrollbar">
            <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
            <v-icon icon="mdi-chevron-right" size="12" />
            <router-link to="/cars" class="hover:text-white transition-colors">Inventory</router-link>
            <v-icon icon="mdi-chevron-right" size="12" />
            <span class="text-white truncate">{{ car.brand }} {{ car.model }}</span>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-12 relative">
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-12">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 flex-wrap">
                <span 
                  class="px-2 py-1 text-[10px] tracking-widest uppercase border"
                  :class="getStatusClasses(car.status)"
                >
                  {{ car.status }}
                </span>
                <span class="text-[10px] sm:text-xs tracking-widest text-gray-500 uppercase">{{ car.year }} • {{ car.category }}</span>
              </div>
              <h1 class="text-2xl sm:text-3xl lg:text-5xl xl:text-7xl font-light tracking-tight mb-3 lg:mb-4">
                {{ car.brand }} <span class="text-gray-500">{{ car.model }}</span>
              </h1>
              <div class="flex flex-wrap items-center gap-3 lg:gap-6 text-xs lg:text-sm tracking-widest text-gray-400 uppercase">
                <span class="flex items-center gap-1 lg:gap-2">
                  <v-icon icon="mdi-gauge" size="14" />
                  {{ formatMileage(car.mileage) }}
                </span>
                <span class="flex items-center gap-1 lg:gap-2">
                  <v-icon icon="mdi-palette" size="14" />
                  {{ car.color }}
                </span>
                <span class="flex items-center gap-1 lg:gap-2">
                  <v-icon icon="mdi-car-shift-pattern" size="14" />
                  {{ car.transmission }}
                </span>
              </div>
            </div>
            
            <div class="lg:text-right shrink-0">
              <p class="text-[10px] sm:text-xs tracking-widest text-gray-500 uppercase mb-1">Price</p>
              <p class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white">${{ formatPrice(car.price) }}</p>
              <p v-if="car.originalPrice" class="text-sm text-gray-600 line-through">
                ${{ formatPrice(car.originalPrice) }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
          
   <!-- Left Column - Gallery & Details -->
<div class="lg:col-span-8 space-y-4 lg:space-y-8">
  
  <!-- Main Image Gallery (keep existing) -->
  <div class="border border-white/10 bg-white/[0.02] overflow-hidden relative group">
    <div 
      class="aspect-[16/10] lg:aspect-[16/9] relative"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <img
        :src="selectedImage || car.images[0] || '/no-image.jpg'"
        :alt="`${car.brand} ${car.model}`"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div class="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
      
      <!-- Mobile: Swipe hint -->
      <div class="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-[10px] text-gray-400 uppercase tracking-wider">
        Swipe for more
      </div>
      
      <!-- Desktop: Image Navigation -->
      <div class="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click="prevImage"
          :disabled="currentImageIndex === 0"
          class="w-12 h-12 border border-white/20 bg-black/50 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-30"
        >
          <v-icon icon="mdi-chevron-left" size="24" />
        </button>
        <button 
          @click="nextImage"
          :disabled="currentImageIndex === car.images.length - 1"
          class="w-12 h-12 border border-white/20 bg-black/50 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-30"
        >
          <v-icon icon="mdi-chevron-right" size="24" />
        </button>
      </div>

      <!-- Counter -->
      <div class="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 border border-white/20 text-xs tracking-widest">
        {{ currentImageIndex + 1 }} / {{ car.images.length }}
      </div>
    </div>

    <!-- Thumbnails - Horizontal scroll on mobile -->
    <div v-if="car.images.length > 1" class="border-t border-white/10 p-3 lg:p-4 bg-white/[0.01]">
      <div class="flex gap-2 lg:gap-3 overflow-x-auto hide-scrollbar pb-2 lg:pb-0 snap-x">
        <button
          v-for="(image, index) in car.images"
          :key="index"
          @click="selectImage(image, index)"
          class="w-16 h-12 lg:w-24 lg:h-16 border overflow-hidden relative shrink-0 snap-start transition-all"
          :class="(selectedImage === image || (!selectedImage && index === 0)) ? 'border-white ring-1 ring-white' : 'border-white/20 hover:border-white/40'"
        >
          <img :src="image" class="w-full h-full object-cover" />
          <div 
            class="absolute inset-0 bg-black/50 transition-opacity"
            :class="(selectedImage === image || (!selectedImage && index === 0)) ? 'opacity-0' : 'opacity-100'"
          />
        </button>
      </div>
    </div>
  </div>

  <!-- Description (keep existing) -->
  <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-8">
    <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 lg:mb-6 border-b border-white/10 pb-3 lg:pb-4">Overview</h3>
    <p class="text-gray-300 leading-relaxed text-sm lg:text-base">{{ car.description }}</p>
  </div>

  <!-- Features (keep existing) -->
  <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-8">
    <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 lg:mb-6 border-b border-white/10 pb-3 lg:pb-4">Features</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
      <div 
        v-for="(feature, index) in car.features" 
        :key="index"
        class="flex items-center gap-3 p-3 lg:p-4 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors"
      >
        <v-icon icon="mdi-check-decagram" size="16" lg="size-18" class="text-emerald-400 shrink-0" />
        <span class="text-sm text-gray-300">{{ feature }}</span>
      </div>
    </div>
  </div>

  <!-- Specifications (keep existing) -->
  <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-8">
    <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 lg:mb-6 border-b border-white/10 pb-3 lg:pb-4">Specifications</h3>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
      <div 
        v-for="spec in specifications" 
        :key="spec.label"
        class="bg-black p-4 lg:p-6"
      >
        <v-icon :icon="spec.icon" size="18" lg="size-20" class="text-gray-600 mb-2 lg:mb-3" />
        <p class="text-[10px] tracking-widest text-gray-500 uppercase mb-1">{{ spec.label }}</p>
        <p class="text-sm lg:text-base font-medium text-white">{{ spec.value }}</p>
      </div>
    </div>
  </div>

  <!-- NEW: PARTS EXPLORER SECTION -->
  <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-8" v-if="car.partImages && car.partImages.length > 0">
    <div class="flex items-center justify-between mb-4 lg:mb-6 border-b border-white/10 pb-3 lg:pb-4">
      <div>
        <h3 class="text-xs tracking-widest text-gray-500 uppercase">Component Gallery</h3>
        <p class="text-sm text-gray-400 mt-1">{{ car.partImages.length }} detailed component photos</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="partsViewMode = 'grid'"
          class="w-8 h-8 border border-white/20 flex items-center justify-center transition-all"
          :class="partsViewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
        >
          <v-icon icon="mdi-view-grid" size="14" />
        </button>
        <button 
          @click="partsViewMode = 'list'"
          class="w-8 h-8 border border-white/20 flex items-center justify-center transition-all"
          :class="partsViewMode === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
        >
          <v-icon icon="mdi-view-list" size="14" />
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="partsViewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="(part, index) in car.partImages"
        :key="part.partId"
        class="group/part relative aspect-square bg-gray-900 border border-white/10 overflow-hidden cursor-pointer"
        @click="openPartModal(part, index)"
      >
        <img 
          :src="part.url" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover/part:scale-110"
          @error="$event.target.src = '/no-image.jpg'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/part:opacity-100 transition-all duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <div class="flex items-center gap-1 mb-1">
              <v-icon icon="mdi-camera" size="10" class="text-white" />
              <span class="text-[10px] text-white uppercase tracking-wider font-medium truncate">{{ part.name }}</span>
            </div>
            <p v-if="part.description" class="text-[9px] text-gray-400 line-clamp-2">{{ part.description }}</p>
          </div>
        </div>
        <div class="absolute top-2 right-2 w-6 h-6 bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover/part:opacity-100 transition-opacity">
          <v-icon icon="mdi-arrow-expand" size="12" class="text-white" />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-2">
      <div
        v-for="(part, index) in car.partImages"
        :key="part.partId"
        class="group/part flex gap-4 p-3 border border-white/10 bg-white/[0.02] hover:border-white/30 cursor-pointer transition-all"
        @click="openPartModal(part, index)"
      >
        <div class="w-20 h-20 bg-gray-900 overflow-hidden shrink-0">
          <img 
            :src="part.url" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover/part:scale-105"
            @error="$event.target.src = '/no-image.jpg'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-white uppercase tracking-wider mb-1">{{ part.name }}</h4>
          <p v-if="part.description" class="text-xs text-gray-400 line-clamp-2">{{ part.description }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-[10px] text-emerald-400 uppercase tracking-wider">View Details</span>
            <v-icon icon="mdi-arrow-right" size="12" class="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Parts Message -->
  <div v-else-if="!carsStore.loading" class="border border-white/10 bg-white/[0.02] p-8 text-center">
    <v-icon icon="mdi-camera-off" size="32" class="text-gray-600 mb-3" />
    <h3 class="text-sm text-gray-400 uppercase tracking-wider mb-1">No Component Photos</h3>
    <p class="text-xs text-gray-600">Detailed part photography not available for this vehicle</p>
  </div>

</div>
          <!-- Right Column - Actions -->
          <div class="lg:col-span-4">
            <div class="lg:sticky lg:top-24 space-y-4 lg:space-y-6">
              
              <!-- Price Card -->
              <div class="border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-4 lg:p-8 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-red-500/10 blur-3xl" />
                <div class="relative">
                  <p class="text-[10px] tracking-widest text-gray-500 uppercase mb-3 lg:mb-4">Investment</p>
                  <p class="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-1">${{ formatPrice(car.price) }}</p>
                  <p v-if="car.originalPrice" class="text-sm text-gray-600 line-through mb-4 lg:mb-6">
                    ${{ formatPrice(car.originalPrice) }}
                  </p>
                  
                  <div class="space-y-2 lg:space-y-3">
                    <button
                      v-if="car.status === 'available'"
                      @click="addToCart"
                      :disabled="cartStore.isInCart(car.id)"
                      class="w-full py-3 lg:py-4 bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <v-icon :icon="cartStore.isInCart(car.id) ? 'mdi-check' : 'mdi-cart-plus'" size="16" />
                      {{ cartStore.isInCart(car.id) ? 'In Cart' : 'Add to Cart' }}
                    </button>
                    
                    <button
                      v-if="car.status === 'available'"
                      class="w-full py-3 lg:py-4 border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      Reserve Now
                    </button>
                    
                    <button class="w-full py-3 lg:py-4 border border-white/20 text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                      Contact Specialist
                    </button>
                  </div>

                  <div class="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-white/10 flex justify-center gap-3 lg:gap-4">
                    <button 
                      v-for="social in socials" 
                      :key="social.icon"
                      class="w-9 h-9 lg:w-10 lg:h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
                    >
                      <v-icon :icon="social.icon" size="14" lg="size-16" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Quick Specs -->
              <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-6">
                <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-3 lg:mb-4">Quick Facts</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span class="text-sm text-gray-500">Stock ID</span>
                    <span class="text-sm font-mono text-white">#{{ car.id?.slice(-6).toUpperCase() }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span class="text-sm text-gray-500">Listed</span>
                    <span class="text-sm text-white">Today</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span class="text-sm text-gray-500">Views</span>
                    <span class="text-sm text-white">1,234</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-500">Location</span>
                    <span class="text-sm text-white">Main Showroom</span>
                  </div>
                </div>
              </div>

              <!-- Specialist Card -->
              <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-6">
                <div class="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <div class="w-10 h-10 lg:w-12 lg:h-12 border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                    <v-icon icon="mdi-account-tie" size="20" lg="size-24" class="text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Luxury Specialist</p>
                    <p class="text-xs text-gray-500">Available 24/7</p>
                  </div>
                </div>
                <button class="w-full py-2.5 lg:py-3 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-widest hover:bg-emerald-500/10 transition-colors">
                  Live Chat
                </button>
              </div>

            </div>
          </div>
        </div>
        <!-- Part Image Modal -->
<Transition name="modal">
  <div 
    v-if="isPartModalOpen && selectedPart" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
    @click.self="closePartModal"
  >
    <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-light text-white uppercase tracking-wider">{{ selectedPart.name }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ selectedPartIndex + 1 }} / {{ car?.partImages?.length }}</p>
        </div>
        <button 
          @click="closePartModal"
          class="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <v-icon icon="mdi-close" size="20" />
        </button>
      </div>

      <!-- Modal Image -->
      <div class="relative flex-1 bg-gray-900 border border-white/10 overflow-hidden group">
        <img 
          :src="selectedPart.url" 
          class="w-full h-full object-contain max-h-[70vh]"
          @error="$event.target.src = '/no-image.jpg'"
        />
        
        <!-- Navigation -->
        <button 
          @click="prevPart"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 bg-black/50 flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
        >
          <v-icon icon="mdi-chevron-left" size="24" />
        </button>
        <button 
          @click="nextPart"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 bg-black/50 flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
        >
          <v-icon icon="mdi-chevron-right" size="24" />
        </button>
      </div>

      <!-- Modal Footer -->
      <div class="mt-4 pt-4 border-t border-white/10">
        <p v-if="selectedPart.description" class="text-sm text-gray-300">{{ selectedPart.description }}</p>
        <p v-else class="text-sm text-gray-600 italic">No description available</p>
      </div>
    </div>
  </div>
</Transition>

        <!-- Related Cars - Fixed -->
        <div v-if="relatedCars.length > 0" class="mt-12 lg:mt-20 border-t border-white/10 pt-8 lg:pt-16">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-2">Curated</span>
              <h2 class="text-2xl lg:text-3xl font-light tracking-tight">Similar <span class="text-gray-500">Vehicles</span></h2>
            </div>
            <router-link 
              to="/cars" 
              class="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              View All
              <v-icon icon="mdi-arrow-right" size="14" />
            </router-link>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            <div 
              v-for="relatedCar in relatedCars" 
              :key="relatedCar.id"
              class="bg-black group"
            >
              <router-link :to="`/cars/${relatedCar.id}`" class="block">
                <div class="aspect-[4/3] overflow-hidden relative">
                  <img 
                    :src="relatedCar.images?.[0] || '/no-image.jpg'" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 ring-1 ring-white/10" />
                </div>
                <div class="p-4 lg:p-6 border-t border-white/10">
                  <p class="text-[10px] tracking-widest text-gray-500 uppercase mb-2">{{ relatedCar.year }} • {{ relatedCar.category }}</p>
                  <h3 class="text-base lg:text-lg font-medium text-white mb-2 truncate">{{ relatedCar.brand }} {{ relatedCar.model }}</h3>
                  <p class="text-lg lg:text-xl font-light text-white">${{ formatPrice(relatedCar.price) }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>


        
        <!-- Debug: Show if no related cars found (remove in production) -->
        <div v-else-if="!carsStore.loading" class="mt-12 lg:mt-20 border-t border-white/10 pt-8 lg:pt-16 text-center">
          <p class="text-gray-500 text-sm">No similar vehicles found. Total cars in store: {{ carsStore.cars.length }}</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const carsStore = useCarsStore()
const cartStore = useCartStore()

const selectedImage = ref<string | null>(null)
const currentImageIndex = ref(0)

const car = computed(() => carsStore.currentCar)

const specifications = computed(() => {
  if (!car.value) return []
  return [
    { label: 'Fuel Type', value: car.value.fuelType, icon: 'mdi-gas-station' },
    { label: 'Transmission', value: car.value.transmission, icon: 'mdi-car-shift-pattern' },
    { label: 'Mileage', value: formatMileage(car.value.mileage), icon: 'mdi-gauge' },
    { label: 'Color', value: car.value.color, icon: 'mdi-palette' },
    { label: 'Engine', value: car.value.engine || 'N/A', icon: 'mdi-engine' },
    { label: 'Horsepower', value: car.value.horsepower ? `${car.value.horsepower} HP` : 'N/A', icon: 'mdi-lightning-bolt' },
    { label: 'Year', value: car.value.year, icon: 'mdi-calendar' },
    { label: 'Category', value: car.value.category, icon: 'mdi-car-sports' },
  ]
})
// Parts Explorer state
const partsViewMode = ref<'grid' | 'list'>('grid')
const selectedPart = ref<typeof car.value.partImages[0] | null>(null)
const selectedPartIndex = ref(0)
const isPartModalOpen = ref(false)

// Parts modal methods
const openPartModal = (part: typeof car.value.partImages[0], index: number) => {
  selectedPart.value = part
  selectedPartIndex.value = index
  isPartModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePartModal = () => {
  isPartModalOpen.value = false
  document.body.style.overflow = ''
}

const nextPart = () => {
  if (!car.value?.partImages) return
  const newIndex = (selectedPartIndex.value + 1) % car.value.partImages.length
  selectedPartIndex.value = newIndex
  selectedPart.value = car.value.partImages[newIndex]
}

const prevPart = () => {
  if (!car.value?.partImages) return
  const newIndex = selectedPartIndex.value === 0 
    ? car.value.partImages.length - 1 
    : selectedPartIndex.value - 1
  selectedPartIndex.value = newIndex
  selectedPart.value = car.value.partImages[newIndex]
}

// Keyboard navigation for modal
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (!isPartModalOpen.value) return
    if (e.key === 'Escape') closePartModal()
    if (e.key === 'ArrowRight') nextPart()
    if (e.key === 'ArrowLeft') prevPart()
  })
})

// FIXED: Related cars computed property with better logic
const relatedCars = computed(() => {
  if (!car.value || !carsStore.cars.length) {
    console.log('Related cars debug: No car or empty cars store', { 
      hasCar: !!car.value, 
      carsCount: carsStore.cars.length 
    })
    return []
  }
  
  const currentCar = car.value
  
  const related = carsStore.cars
    .filter(c => {
      // Must be different car
      if (c.id === currentCar.id) return false
      
      // Match by category OR brand
      const sameCategory = c.category?.toLowerCase() === currentCar.category?.toLowerCase()
      const sameBrand = c.brand?.toLowerCase() === currentCar.brand?.toLowerCase()
      
      return sameCategory || sameBrand
    })
    .slice(0, 4)
    
  console.log('Related cars found:', related.length, 'out of', carsStore.cars.length, 'total cars')
  return related
})

const socials = [
  { icon: 'mdi-facebook' },
  { icon: 'mdi-twitter' },
  { icon: 'mdi-whatsapp' },
  { icon: 'mdi-share-variant' },
]

const getStatusClasses = (status: string) => {
  const classes: Record<string, string> = {
    available: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    reserved: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
    sold: 'border-red-500/30 text-red-400 bg-red-500/5',
  }
  return classes[status?.toLowerCase()] || 'border-gray-500/30 text-gray-400 bg-gray-500/5'
}

const formatPrice = (price: number) => price?.toLocaleString('en-US') || '0'

const formatMileage = (mileage: number) => {
  if (!mileage) return '0 mi'
  if (mileage >= 1000) return `${(mileage / 1000).toFixed(1)}k mi`
  return `${mileage} mi`
}

const selectImage = (image: string, index: number) => {
  selectedImage.value = image
  currentImageIndex.value = index
}

const nextImage = () => {
  if (car.value && currentImageIndex.value < car.value.images.length - 1) {
    currentImageIndex.value++
    selectedImage.value = car.value.images[currentImageIndex.value]
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    selectedImage.value = car.value?.images[currentImageIndex.value] || null
  }
}

const addToCart = () => {
  if (car.value) {
    cartStore.addToCart(car.value)
  }
}

// Touch swipe support for mobile gallery
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  if (touchEndX < touchStartX - swipeThreshold) {
    nextImage()
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    prevImage()
  }
}

// FIXED: Load cars list and current car
const loadData = async () => {
  const carId = route.params.id as string
  
  // IMPORTANT: Fetch all cars first (needed for related cars section)
  if (carsStore.cars.length === 0) {
    console.log('Fetching all cars for related section...')
    await carsStore.fetchCars()
  }
  
  // Then fetch specific car details
  console.log('Fetching car details for ID:', carId)
  await carsStore.fetchCarById(carId)
}

// Watch for route changes to reload data
watch(() => route.params.id, () => {
  selectedImage.value = null
  currentImageIndex.value = 0
  loadData()
}, { immediate: false })

onMounted(() => {
  loadData()
})
</script>

<style scoped>
* {
  border-radius: 0 !important;
}

:deep(.v-icon) {
  border-radius: 0 !important;
}

::selection {
  background: white;
  color: black;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.fade-in {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Touch device optimizations */
@media (hover: none) {
  .group:active {
    transform: scale(0.98);
  }
}
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>