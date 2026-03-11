<!-- CarsView.vue - With Car Parts Explorer -->
<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-12 lg:pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6">
          <div>
            <span class="text-[10px] sm:text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Inventory</span>
            <h1 class="text-3xl sm:text-4xl lg:text-6xl font-light tracking-tight">
              OUR <span class="text-gray-500">COLLECTION</span>
            </h1>
          </div>
          <div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <!-- View Mode Toggle: Standard | Parts -->
            <div class="flex border border-white/20">
              <button 
                @click="exploreMode = 'standard'"
                class="px-4 py-2 text-[10px] uppercase tracking-wider transition-all"
                :class="exploreMode === 'standard' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
              >
                Standard
              </button>
              <button 
                @click="exploreMode = 'parts'"
                class="px-4 py-2 text-[10px] uppercase tracking-wider border-l border-white/20 transition-all flex items-center gap-2"
                :class="exploreMode === 'parts' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
              >
                <v-icon icon="mdi-view-module" size="12" />
                Parts
              </button>
            </div>
            <p class="text-gray-400 max-w-md text-sm font-light leading-relaxed lg:text-right">
              Browse our curated selection of premium vehicles.
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
      
      <!-- Mobile: Filter Toggle Button -->
      <div class="lg:hidden mb-4">
        <button 
          @click="showMobileFilters = !showMobileFilters"
          class="w-full py-3 px-4 border border-white/20 bg-white/5 flex items-center justify-between"
        >
          <span class="text-xs uppercase tracking-wider flex items-center gap-2">
            <v-icon icon="mdi-filter" size="16" />
            Filters & Sort
          </span>
          <v-icon :icon="showMobileFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" />
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-12">
        
        <!-- Sidebar Filters -->
        <aside 
          class="w-full lg:w-80 shrink-0"
          :class="{ 'hidden lg:block': !showMobileFilters }"
        >
          <div class="border border-white/10 bg-white/[0.02] p-4 lg:p-6 lg:sticky lg:top-24">
            
            <!-- Filter Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 class="text-xs sm:text-sm tracking-widest uppercase font-medium">Filters</h3>
              <button 
                @click="clearAllFilters"
                class="text-[10px] sm:text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
              >
                Reset
              </button>
            </div>

            <!-- Search -->
            <div class="mb-6">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Search</label>
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text"
                  placeholder="Brand or model..."
                  class="w-full bg-transparent border border-white/20 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                />
                <v-icon icon="mdi-magnify" size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Category</label>
              <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  @click="selectedCategory = selectedCategory === cat ? '' : cat"
                  class="text-left px-3 py-2 text-xs border transition-all flex items-center justify-between"
                  :class="selectedCategory === cat ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'"
                >
                  {{ cat }}
                  <span v-if="selectedCategory === cat" class="text-xs">✓</span>
                </button>
              </div>
            </div>

            <!-- Brand -->
            <div class="mb-6">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Brand</label>
              <select 
                v-model="selectedBrand"
                class="w-full bg-black border border-white/20 px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" class="bg-black text-gray-400">All Brands</option>
                <option v-for="brand in carsStore.brands" :key="brand" :value="brand" class="bg-black text-white">{{ brand }}</option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Max Price: ${{ formatPrice(priceRange[1]) }}</label>
              <input 
                type="range" 
                v-model="priceRange[1]" 
                :min="0" 
                :max="900000" 
                :step="10000"
                class="w-full accent-white bg-white/10 h-1 appearance-none cursor-pointer"
              />
            </div>

            <!-- Year Range -->
            <div class="mb-6">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Year Range</label>
              <div class="flex gap-2">
                <input 
                  v-model.number="yearRange[0]"
                  type="number"
                  placeholder="From"
                  class="w-1/2 bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none"
                />
                <input 
                  v-model.number="yearRange[1]"
                  type="number"
                  placeholder="To"
                  class="w-1/2 bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <!-- Fuel & Transmission -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Fuel</label>
                <select 
                  v-model="selectedFuelType"
                  class="w-full bg-black border border-white/20 px-2 py-2 text-xs text-white focus:border-white focus:outline-none appearance-none"
                >
                  <option value="" class="bg-black">All</option>
                  <option v-for="fuel in fuelTypes" :key="fuel" :value="fuel" class="bg-black">{{ fuel }}</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Trans</label>
                <select 
                  v-model="selectedTransmission"
                  class="w-full bg-black border border-white/20 px-2 py-2 text-xs text-white focus:border-white focus:outline-none appearance-none"
                >
                  <option value="" class="bg-black">All</option>
                  <option v-for="trans in transmissions" :key="trans" :value="trans" class="bg-black">{{ trans }}</option>
                </select>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Status</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="status in statuses"
                  :key="status"
                  @click="selectedStatus = selectedStatus === status ? '' : status"
                  class="px-2 py-1 text-[10px] border transition-all uppercase tracking-wider"
                  :class="selectedStatus === status ? 'border-white bg-white text-black' : 'border-white/10 text-gray-500 hover:border-white/30'"
                >
                  {{ status }}
                </button>
              </div>
            </div>

            <!-- Mobile: Apply Filters Button -->
            <button 
              @click="showMobileFilters = false"
              class="lg:hidden w-full mt-6 py-3 bg-white text-black text-xs uppercase tracking-wider font-medium"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <!-- Results Area -->
        <main class="flex-1 min-w-0">
          
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div class="text-sm text-gray-400 font-light">
              Showing <span class="text-white font-medium">{{ filteredCars.length }}</span> vehicles
              <span v-if="exploreMode === 'parts'" class="ml-2 text-emerald-400 text-xs uppercase tracking-wider">[Parts Mode]</span>
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Sort -->
              <div class="flex items-center gap-2 flex-1 sm:flex-none">
                <span class="text-xs text-gray-500 uppercase tracking-wider hidden sm:block">Sort</span>
                <select 
                  v-model="sortBy"
                  class="bg-black border border-white/20 px-3 py-2 text-sm text-white focus:border-white focus:outline-none appearance-none cursor-pointer w-full sm:w-auto sm:min-w-[140px]"
                >
                  <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value" class="bg-black">{{ opt.title }}</option>
                </select>
              </div>

              <!-- View Toggle -->
              <div class="flex border border-white/20 shrink-0">
                <button 
                  @click="viewMode = 'grid'"
                  class="p-2 transition-colors"
                  :class="viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
                >
                  <v-icon icon="mdi-view-grid" size="18" />
                </button>
                <button 
                  @click="viewMode = 'list'"
                  class="p-2 transition-colors border-l border-white/20"
                  :class="viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'"
                >
                  <v-icon icon="mdi-view-list" size="18" />
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="carsStore.loading" class="flex justify-center py-12 lg:py-20">
            <div class="flex flex-col items-center gap-3">
              <div class="w-10 h-10 lg:w-12 lg:h-12 border-2 border-white/20 border-t-white animate-spin" />
              <span class="text-xs text-gray-500 uppercase tracking-widest">Loading</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredCars.length === 0" class="border border-white/10 p-8 lg:p-20 text-center">
            <v-icon icon="mdi-car-off" size="40" lg="size-48" class="text-gray-700 mb-4 lg:mb-6" />
            <h3 class="text-lg lg:text-xl font-light mb-2">No vehicles found</h3>
            <p class="text-gray-500 text-sm mb-6 lg:mb-8 font-light">Adjust your filters to see more results</p>
            <button 
              @click="clearAllFilters"
              class="px-6 py-3 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Clear All Filters
            </button>
          </div>

          <!-- GRID VIEW -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <div 
              v-for="car in paginatedCars" 
              :key="car.id"
              class="group border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/[0.02] cursor-pointer relative overflow-hidden"
              :class="{ 'parts-active': activePartsCar === car.id }"
              @click="exploreMode === 'standard' ? $router.push(`/cars/${car.id}`) : null"
            >
            <div class="aspect-[4/3] overflow-hidden bg-gray-900 relative">
              <img :src="car.images[0]" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              <!-- Status Badge -->
              <div class="absolute top-0 left-0 p-3 lg:p-4 z-10">
                <span 
                  class="px-2 py-1 text-[10px] uppercase tracking-wider font-medium"
                  :class="car.status === 'Available' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'"
                >
                  {{ car.status }}
                </span>
              </div>

              <!-- PARTS MODE: Always visible overlay -->
              <CarPartsOverlay 
                v-if="exploreMode === 'parts'"
                :part-images="car.partImages"
                :category="car.category"
                :force-show="true"
                @close="exploreMode = 'standard'"
                @part-click="handlePartClick($event, car)"
                class="!opacity-100"
              />

              <!-- STANDARD MODE: Hover overlay (MUST BE DIRECTLY AFTER v-if, no elements between!) -->
              <CarPartsOverlay 
                v-else
                :part-images="car.partImages"
                :category="car.category"
                @part-click="handlePartClick($event, car)"
              />

              <!-- Gradient overlay - MOVED AFTER v-if/v-else blocks -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
              
              <!-- Quick Action: View Parts (Standard mode only) -->
              <button
                v-if="exploreMode === 'standard'"
                @click.stop="activePartsCar = activePartsCar === car.id ? null : car.id"
                class="absolute bottom-3 right-3 z-30 w-10 h-10 border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                :class="{ 'opacity-100 bg-white text-black': activePartsCar === car.id }"
              >
                <v-icon :icon="activePartsCar === car.id ? 'mdi-close' : 'mdi-car-cog'" size="16" />
              </button>
            </div>

              <!-- Content -->
              <div class="p-4 lg:p-6 relative z-10 bg-black">
                <div class="flex items-start justify-between mb-3 lg:mb-4">
                  <div class="min-w-0 flex-1">
                    <div class="text-[10px] tracking-widest text-gray-500 uppercase mb-1">{{ car.year }} • {{ car.category }}</div>
                    <h3 class="text-base lg:text-lg font-medium text-white group-hover:text-gray-300 transition-colors truncate">{{ car.brand }} {{ car.model }}</h3>
                  </div>
                  <v-icon icon="mdi-arrow-top-right" size="18" lg="size-20" class="text-gray-600 group-hover:text-white transition-colors shrink-0 ml-2" />
                </div>

                <div class="flex items-center justify-between pt-3 lg:pt-4 border-t border-white/10">
                  <div class="text-lg lg:text-xl font-light text-white">${{ formatPrice(car.price) }}</div>
                  <div class="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                      <v-icon icon="mdi-gas-station" size="12" lg="size-14" />
                      {{ car.fuelType }}
                    </span>
                    <span class="flex items-center gap-1">
                      <v-icon icon="mdi-speedometer" size="12" lg="size-14" />
                      {{ formatPrice(car.mileage) }} mi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- LIST VIEW -->
          <div v-else class="space-y-3 lg:space-y-4">
            <div 
              v-for="car in paginatedCars" 
              :key="car.id"
              class="group flex flex-col sm:flex-row border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/[0.02] cursor-pointer overflow-hidden"
              @click="exploreMode === 'standard' ? $router.push(`/cars/${car.id}`) : null"
            >
              <!-- Image with Parts Preview -->
              <div class="w-full sm:w-48 md:w-56 aspect-video sm:aspect-[4/3] overflow-hidden bg-gray-900 shrink-0 relative">
                <img :src="car.images[0]" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                <!-- Parts mini-indicator for list view -->
                <div 
                  v-if="exploreMode === 'parts'"
                  class="absolute inset-0 bg-black/80 flex items-center justify-center"
                >
                  <div class="text-center">
                    <v-icon icon="mdi-car-cog" size="24" class="text-white mb-2" />
                    <span class="text-[10px] uppercase tracking-wider text-gray-400">Parts View</span>
                  </div>
                </div>

                <!-- Hover parts button -->
                <button
                  v-else
                  @click.stop="activePartsCar = activePartsCar === car.id ? null : car.id"
                  class="absolute bottom-2 right-2 z-20 w-8 h-8 border border-white/30 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                >
                  <v-icon icon="mdi-car-cog" size="14" />
                </button>
              </div>

              <!-- Content -->
              <div class="flex-1 p-4 lg:p-6 flex flex-col justify-between min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                      <span class="text-[10px] tracking-widest text-gray-500 uppercase">{{ car.year }}</span>
                      <span class="w-1 h-1 bg-gray-700" />
                      <span class="text-[10px] tracking-widest text-gray-500 uppercase">{{ car.category }}</span>
                      <span class="w-1 h-1 bg-gray-700 hidden sm:block" />
                      <span 
                        class="text-[10px] uppercase tracking-wider px-2 py-0.5 border"
                        :class="car.status === 'Available' ? 'border-white text-white' : 'border-gray-700 text-gray-500'"
                      >
                        {{ car.status }}
                      </span>
                    </div>
                    <h3 class="text-lg lg:text-xl font-medium text-white group-hover:text-gray-300 transition-colors truncate">{{ car.brand }} {{ car.model }}</h3>
                  </div>
                  <div class="text-xl lg:text-2xl font-light text-white ml-4 shrink-0">${{ formatPrice(car.price) }}</div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-white/10">
                  <div class="flex items-center gap-4 lg:gap-6 text-xs text-gray-500 flex-wrap">
                    <span class="flex items-center gap-1">
                      <v-icon icon="mdi-gas-station" size="14" />
                      {{ car.fuelType }}
                    </span>
                    <span class="flex items-center gap-1">
                      <v-icon icon="mdi-speedometer" size="14" />
                      {{ formatPrice(car.mileage) }} mi
                    </span>
                    <span class="flex items-center gap-1 hidden sm:flex">
                      <v-icon icon="mdi-engine" size="14" />
                      {{ car.transmission }}
                    </span>
                    <!-- Parts count badge -->
                    <span 
                      v-if="exploreMode === 'parts' || activePartsCar === car.id"
                      class="flex items-center gap-1 text-emerald-400"
                    >
                      <v-icon icon="mdi-car-cog" size="14" />
                      {{ getPartsCount(car.category) }} Parts
                    </span>
                  </div>
                  <v-icon icon="mdi-arrow-right" size="18" class="text-gray-600 group-hover:text-white transition-colors shrink-0" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8 lg:mt-12">
            <div class="flex items-center gap-1">
              <button 
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center border border-white/20 text-gray-500 hover:text-white hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <v-icon icon="mdi-chevron-left" size="18" />
              </button>
              
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="currentPage = page"
                class="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center border text-sm transition-colors"
                :class="page === currentPage ? 'border-white bg-white text-black' : 'border-white/20 text-gray-500 hover:text-white hover:border-white/50'"
              >
                {{ page }}
              </button>

              <span v-if="showEllipsis" class="px-1 text-gray-600">...</span>

              <button 
                v-if="totalPages > 5 && currentPage < totalPages - 2"
                @click="currentPage = totalPages"
                class="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center border border-white/20 text-gray-500 hover:text-white hover:border-white/50 text-sm transition-colors"
              >
                {{ totalPages }}
              </button>

              <button 
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center border border-white/20 text-gray-500 hover:text-white hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <v-icon icon="mdi-chevron-right" size="18" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Part Detail Modal -->
    <v-dialog v-model="partDetailDialog" max-width="500" content-class="sharp-dialog">
      <div v-if="selectedPart && selectedCarForPart" class="bg-[#0a0a0a] border border-white/20 text-white">
        <div class="p-6 border-b border-white/10 flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 border border-white/20 flex items-center justify-center">
              <v-icon :icon="selectedPart.icon" size="24" class="text-white" />
            </div>
            <div>
              <span class="text-[10px] tracking-widest text-gray-500 uppercase block">{{ selectedCarForPart.brand }} {{ selectedCarForPart.model }}</span>
              <h3 class="text-xl font-light">{{ selectedPart.name }}</h3>
            </div>
          </div>
          <button @click="partDetailDialog = false" class="w-8 h-8 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <v-icon icon="mdi-close" size="16" />
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="aspect-video bg-gray-900 relative overflow-hidden">
            <img :src="selectedCarForPart.images[0]" class="w-full h-full object-cover opacity-50" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <v-icon :icon="selectedPart.icon" size="48" class="text-white mb-2" />
                <p class="text-xs uppercase tracking-widest text-gray-400">Component Visualization</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-white/10">
              <span class="text-sm text-gray-500 uppercase tracking-wider">Condition</span>
              <span class="text-sm text-emerald-400 font-medium">{{ selectedPart.condition }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-white/10">
              <span class="text-sm text-gray-500 uppercase tracking-wider">Category</span>
              <span class="text-sm text-white">{{ selectedCarForPart.category }}</span>
            </div>
            <div v-if="selectedPart.price" class="flex justify-between items-center py-3 border-b border-white/10">
              <span class="text-sm text-gray-500 uppercase tracking-wider">Est. Value</span>
              <span class="text-sm text-white">${{ selectedPart.price.toLocaleString() }}</span>
            </div>
          </div>

          <p class="text-sm text-gray-400 leading-relaxed">{{ selectedPart.description }}</p>

          <div class="flex gap-3 pt-4">
            <button 
              @click="$router.push(`/cars/${selectedCarForPart.id}`)"
              class="flex-1 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              View Full Details
            </button>
            <button 
              @click="partDetailDialog = false"
              class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCarsStore } from '@/stores/cars'
import CarPartsOverlay from '@/components/CarPartsOverlay.vue'
import { getCarParts } from '@/composables/useCarParts'

const carsStore = useCarsStore()

// Mobile filter toggle
const showMobileFilters = ref(false)

// NEW: Explore mode - 'standard' or 'parts'
const exploreMode = ref('standard')
const activePartsCar = ref(null)

// Part detail modal
const partDetailDialog = ref(false)
const selectedPart = ref(null)
const selectedCarForPart = ref(null)

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const priceRange = ref([0, 900000])
const yearRange = ref([2000, 2026])
const selectedFuelType = ref('')
const selectedTransmission = ref('')
const selectedStatus = ref('')

// View & Sort
const viewMode = ref('grid')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const categories = ['Sedan', 'SUV', 'Truck', 'Sports', 'Luxury', 'Electric']
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid']
const transmissions = ['Automatic', 'Manual']
const statuses = ['Available', 'Reserved', 'Sold']

const sortOptions = [
  { title: 'Newest', value: 'newest' },
  { title: 'Price ↑', value: 'price-asc' },
  { title: 'Price ↓', value: 'price-desc' },
  { title: 'Year ↑', value: 'year-asc' },
  { title: 'Year ↓', value: 'year-desc' },
  { title: 'Mileage', value: 'mileage-asc' }
]

const formatPrice = (price) => price?.toLocaleString('en-US') || '0'

// Get parts count for display
const getPartsCount = (category) => {
  return getCarParts(category).length
}

// Handle part click
const handlePartClick = (part, car) => {
  selectedPart.value = part
  selectedCarForPart.value = car
  partDetailDialog.value = true
}

// Adjust items per page based on screen size
const updateItemsPerPage = () => {
  if (window.innerWidth < 640) {
    itemsPerPage.value = 6
  } else if (window.innerWidth < 1024) {
    itemsPerPage.value = 8
  } else {
    itemsPerPage.value = 9
  }
}

// Filtered & Sorted Cars
const filteredCars = computed(() => {
  let result = [...(carsStore.cars || [])]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.brand?.toLowerCase().includes(q) || 
      c.model?.toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(c => 
      c.category?.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  if (selectedBrand.value) {
    result = result.filter(c => c.brand === selectedBrand.value)
  }

  result = result.filter(c => 
    c.price >= priceRange.value[0] && c.price <= priceRange.value[1]
  )

  result = result.filter(c => 
    c.year >= yearRange.value[0] && c.year <= yearRange.value[1]
  )

  if (selectedFuelType.value) {
    result = result.filter(c => 
      c.fuelType?.toLowerCase() === selectedFuelType.value.toLowerCase()
    )
  }

  if (selectedTransmission.value) {
    result = result.filter(c => 
      c.transmission?.toLowerCase() === selectedTransmission.value.toLowerCase()
    )
  }

  if (selectedStatus.value) {
    result = result.filter(c => 
      c.status?.toLowerCase() === selectedStatus.value.toLowerCase()
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break
    case 'price-desc': result.sort((a, b) => b.price - a.price); break
    case 'year-asc': result.sort((a, b) => a.year - b.year); break
    case 'year-desc': result.sort((a, b) => b.year - a.year); break
    case 'mileage-asc': result.sort((a, b) => a.mileage - b.mileage); break
    default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredCars.value.length / itemsPerPage.value))

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = window.innerWidth < 640 ? 3 : 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > (window.innerWidth < 640 ? 3 : 5) && currentPage.value < totalPages.value - 2
})

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredCars.value.slice(start, start + itemsPerPage.value)
})

// Reset page on filter change
watch([searchQuery, selectedCategory, selectedBrand, priceRange, yearRange, 
       selectedFuelType, selectedTransmission, selectedStatus], () => {
  currentPage.value = 1
}, { deep: true })

// Reset active parts car when changing modes
watch(exploreMode, () => {
  activePartsCar.value = null
})

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedBrand.value = ''
  priceRange.value = [0, 900000]
  yearRange.value = [2000, 2024]
  selectedFuelType.value = ''
  selectedTransmission.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  exploreMode.value = 'standard'
  activePartsCar.value = null
}

onMounted(() => {
  carsStore.fetchCars()
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Custom range slider */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  cursor: pointer;
  border-radius: 0;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  cursor: pointer;
  border-radius: 0;
  border: none;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Vuetify overrides */
:deep(.v-icon) {
  border-radius: 0 !important;
}

/* Selection */
::selection {
  background: white;
  color: black;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Touch device optimizations */
@media (hover: none) {
  .group:active {
    transform: scale(0.98);
  }
}

/* Parts active state */
.parts-active {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

/* Animation for part details */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideIn 0.3s ease-out forwards;
}

/* Dialog styling */
:deep(.v-overlay__content) {
  border-radius: 0 !important;
}

:deep(.v-dialog) {
  border-radius: 0 !important;
}
</style>