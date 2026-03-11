<!-- AdminCarsView.vue - With Car Part Images Support -->
<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 bg-gradient-to-r from-red-950/20 via-black to-black relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" opacity="10" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 border border-red-500/30 bg-red-500/10 flex items-center justify-center shrink-0">
              <v-icon icon="mdi-car-cog" size="28" class="text-red-400" />
            </div>
            <div>
              <span class="text-xs tracking-[0.3em] text-red-400 uppercase block mb-2">Inventory Management</span>
              <h1 class="text-3xl lg:text-5xl font-light tracking-tight">
                MANAGE <span class="text-gray-500">CARS</span>
              </h1>
              <p class="text-gray-400 text-sm mt-2 font-light">
                {{ filteredCars.length }} vehicles in inventory
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <router-link 
              to="/admin" 
              class="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              <v-icon icon="mdi-arrow-left" size="14" />
              Back
            </router-link>
            <button 
              @click="openAddDialog"
              class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-wider hover:bg-emerald-500/30 transition-all"
            >
              <v-icon icon="mdi-plus" size="16" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
      
      <!-- Error Alert -->
      <div v-if="saveError" class="mb-6 border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <v-icon icon="mdi-alert-circle" size="20" class="text-red-400" />
          <span class="text-sm text-red-400">{{ saveError }}</span>
        </div>
        <button @click="saveError = null" class="text-red-400 hover:text-red-300">
          <v-icon icon="mdi-close" size="16" />
        </button>
      </div>

      <!-- Filters Bar -->
      <div class="border border-white/10 bg-white/[0.02] p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 relative">
            <v-icon icon="mdi-magnify" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search by brand or model..."
              class="w-full bg-transparent border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
          
          <div class="flex gap-4 flex-col sm:flex-row">
            <select 
              v-model="filterStatus"
              class="bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none transition-colors w-full sm:min-w-[140px]"
            >
              <option value="All" class="bg-black">All Status</option>
              <option value="Available" class="bg-black">Available</option>
              <option value="Reserved" class="bg-black">Reserved</option>
              <option value="Sold" class="bg-black">Sold</option>
            </select>
            
            <select 
              v-model="filterCategory"
              class="bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none transition-colors w-full sm:min-w-[140px]"
            >
              <option value="All" class="bg-black">All Categories</option>
              <option value="Sedan" class="bg-black">Sedan</option>
              <option value="SUV" class="bg-black">SUV</option>
              <option value="Truck" class="bg-black">Truck</option>
              <option value="Sports" class="bg-black">Sports</option>
              <option value="Luxury" class="bg-black">Luxury</option>
              <option value="Electric" class="bg-black">Electric</option>
            </select>
            
            <button 
              @click="clearFilters"
              class="px-4 py-3 border border-white/10 text-xs uppercase tracking-wider text-gray-400 hover:text-white hover:border-white/30 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Cars Grid -->
      <div v-if="carsStore.loading" class="flex justify-center items-center py-32">
        <div class="relative">
          <div class="w-12 h-12 border border-white/20 border-t-white animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-6 border border-white/10 border-t-white/50 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredCars.length === 0" class="border border-white/10 p-20 text-center">
        <div class="w-20 h-20 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <v-icon icon="mdi-car-off" size="32" class="text-gray-600" />
        </div>
        <h2 class="text-2xl font-light mb-3">No vehicles found</h2>
        <p class="text-gray-500 text-sm mb-8 font-light">
          {{ searchQuery || filterStatus !== 'All' || filterCategory !== 'All' ? 'Try adjusting your filters' : 'Start by adding your first vehicle to the inventory' }}
        </p>
        <button 
          @click="openAddDialog"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium"
        >
          <v-icon icon="mdi-plus" size="16" />
          Add Vehicle
        </button>
      </div>

      <div v-else class="border border-white/10 bg-white/[0.02] overflow-hidden">
        <!-- RESPONSIVE FIX: Scroll wrapper for table -->
        <div class="overflow-x-auto">
          <div class="min-w-[800px]">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.03] text-[10px] tracking-widest text-gray-500 uppercase">
              <div class="col-span-2">Image</div>
              <div class="col-span-3">Vehicle</div>
              <div class="col-span-2">Price</div>
              <div class="col-span-2">Status</div>
              <div class="col-span-2">Category</div>
              <div class="col-span-1 text-right">Actions</div>
            </div>

            <!-- Table Rows -->
            <div class="divide-y divide-white/5">
              <div 
                v-for="car in filteredCars" 
                :key="car.id"
                class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors group"
              >
                <!-- Image -->
                <div class="col-span-2">
                  <div class="w-24 h-16 overflow-hidden bg-gray-900 relative">
                    <v-img 
                      :src="car.images?.[0] || '/no-image.jpg'" 
                      cover 
                      class="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 ring-1 ring-white/10" />
                    <!-- Part images indicator -->
                    <div v-if="car.partImages?.length" class="absolute bottom-0 right-0 bg-black/80 px-1.5 py-0.5">
                      <v-icon icon="mdi-camera" size="10" class="text-emerald-400" />
                    </div>
                  </div>
                </div>

                <!-- Vehicle Info -->
                <div class="col-span-3">
                  <h3 class="text-sm font-medium text-white mb-1">{{ car.brand }} {{ car.model }}</h3>
                  <div class="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                    <span>{{ car.year }}</span>
                    <span class="w-1 h-1 bg-gray-700 rounded-full" />
                    <span>{{ car.mileage?.toLocaleString() }} mi</span>
                  </div>
                </div>

                <!-- Price -->
                <div class="col-span-2">
                  <span class="text-lg font-light text-white">${{ formatPrice(car.price) }}</span>
                  <div v-if="car.originalPrice && car.originalPrice > car.price" class="text-[10px] text-gray-500 line-through">
                    ${{ formatPrice(car.originalPrice) }}
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-2">
                  <span 
                    class="px-3 py-1 text-[10px] tracking-widest uppercase border"
                    :class="getStatusClasses(car.status)"
                  >
                    {{ car.status }}
                  </span>
                </div>

                <!-- Category -->
                <div class="col-span-2">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">{{ car.category }}</span>
                </div>

                <!-- Actions -->
                <div class="col-span-1 flex items-center justify-end gap-1">
                  <router-link 
                    :to="`/cars/${car.id}`"
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
                    title="View"
                  >
                    <v-icon icon="mdi-eye" size="14" />
                  </router-link>
                  <button 
                    @click="openEditDialog(car)"
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-400/30 transition-all"
                    title="Edit"
                  >
                    <v-icon icon="mdi-pencil" size="14" />
                  </button>
                  <button 
                    @click="confirmDelete(car)"
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all"
                    title="Delete"
                  >
                    <v-icon icon="mdi-delete" size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span class="text-xs text-gray-500">
            Showing {{ filteredCars.length }} of {{ carsStore.cars.length }} vehicles
          </span>
          <div class="flex gap-2">
            <button class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all disabled:opacity-30" disabled>
              <v-icon icon="mdi-chevron-left" size="16" />
            </button>
            <button class="w-8 h-8 border border-white bg-white text-black flex items-center justify-center text-xs font-medium">
              1
            </button>
            <button class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all disabled:opacity-30" disabled>
              <v-icon icon="mdi-chevron-right" size="16" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Car Dialog -->
    <v-dialog v-model="carDialog" max-width="1000" content-class="sharp-dialog" persistent>
      <div class="bg-[#0a0a0a] border border-white/20 text-white max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
          <div>
            <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-1">
              {{ isEditing ? 'Editing Vehicle' : 'New Vehicle' }}
            </span>
            <h2 class="text-2xl font-light">
              {{ isEditing ? `${carFormData.brand} ${carFormData.model}` : 'Add to Inventory' }}
            </h2>
          </div>
          <button 
            @click="closeDialog" 
            class="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all"
          >
            <v-icon icon="mdi-close" size="20" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-8">
          
          <!-- TABS -->
          <div class="flex border-b border-white/10">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-3 text-xs uppercase tracking-wider transition-all border-b-2 -mb-px flex items-center gap-2"
              :class="activeTab === tab.id ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'"
            >
              <v-icon :icon="tab.icon" size="14" />
              {{ tab.name }}
              <span v-if="tab.id === 'parts' && partImages.length > 0" class="ml-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px]">
                {{ partImages.length }}
              </span>
            </button>
          </div>

          <!-- TAB: Basic Info -->
          <div v-if="activeTab === 'basic'" class="space-y-6">
            <div>
              <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-white/10 pb-2">Basic Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Brand *</label>
                  <input 
                    v-model="carFormData.brand"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="e.g., Mercedes-Benz"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Model *</label>
                  <input 
                    v-model="carFormData.model"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="e.g., S-Class"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Year *</label>
                  <input 
                    v-model.number="carFormData.year"
                    type="number"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Price *</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      v-model.number="carFormData.price"
                      type="number"
                      class="w-full bg-transparent border border-white/20 pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Original Price (Optional)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      v-model.number="carFormData.originalPrice"
                      type="number"
                      class="w-full bg-transparent border border-white/20 pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Category *</label>
                  <select 
                    v-model="carFormData.category"
                    class="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="sports">Sports</option>
                    <option value="luxury">Luxury</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div>
              <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-white/10 pb-2">Specifications</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Fuel Type *</label>
                  <select 
                    v-model="carFormData.fuelType"
                    class="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Transmission *</label>
                  <select 
                    v-model="carFormData.transmission"
                    class="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Mileage *</label>
                  <div class="relative">
                    <input 
                      v-model.number="carFormData.mileage"
                      type="number"
                      class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">mi</span>
                  </div>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Color *</label>
                  <input 
                    v-model="carFormData.color"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="e.g., Obsidian Black"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Status *</label>
                  <select 
                    v-model="carFormData.status"
                    class="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Engine</label>
                  <input 
                    v-model="carFormData.engine"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="e.g., 4.0L V8 Biturbo"
                  />
                </div>
              </div>
            </div>

            <!-- Performance -->
            <div>
              <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-white/10 pb-2">Performance</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Horsepower</label>
                  <div class="relative">
                    <input 
                      v-model.number="carFormData.horsepower"
                      type="number"
                      class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                      placeholder="0"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">HP</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Description *</label>
              <textarea 
                v-model="carFormData.description"
                rows="3"
                class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none"
                placeholder="Enter detailed description of the vehicle..."
              />
            </div>

            <!-- Features -->
            <div>
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Features</label>
              <div class="border border-white/20 p-4 bg-white/[0.02]">
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    v-for="(feature, index) in carFormData.features" 
                    :key="index"
                    class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-xs text-white"
                  >
                    {{ feature }}
                    <button @click="removeFeature(index)" class="hover:text-red-400 transition-colors">
                      <v-icon icon="mdi-close" size="12" />
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input 
                    v-model="newFeature"
                    type="text"
                    class="flex-1 bg-transparent border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Add feature and press Enter"
                    @keyup.enter="addFeature"
                  />
                  <button 
                    @click="addFeature"
                    class="px-4 py-2 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Main Images -->
          <div v-if="activeTab === 'images'" class="space-y-6">
            <div>
              <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-white/10 pb-2">Main Vehicle Images</h3>
              <p class="text-sm text-gray-400 mb-4">Enter image URLs for the main gallery. First image will be the thumbnail.</p>
              
              <textarea 
                v-model="imagesInput"
                rows="4"
                class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none font-mono text-xs"
                placeholder="https://example.com/car-front.jpg&#10;https://example.com/car-side.jpg&#10;https://example.com/car-interior.jpg"
              />
              <p class="text-[10px] text-gray-600 mt-2">Enter one URL per line. Minimum 1 image required.</p>
            </div>

            <!-- Image Preview -->
            <div v-if="imagePreviewList.length > 0">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-3">Preview ({{ imagePreviewList.length }} images)</h4>
              <div class="grid grid-cols-4 gap-3">
                <div 
                  v-for="(url, index) in imagePreviewList" 
                  :key="index"
                  class="aspect-video bg-gray-900 relative overflow-hidden group border border-white/10"
                  :class="{ 'ring-2 ring-white': index === 0 }"
                >
                  <img 
                    :src="url" 
                    class="w-full h-full object-cover"
                    @error="handleImageError($event)"
                  />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-[10px] text-white">#{{ index + 1 }}</span>
                  </div>
                  <div v-if="index === 0" class="absolute top-0 left-0 bg-white text-black px-2 py-0.5 text-[10px] uppercase">
                    Main
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Part Images (NEW) -->
          <div v-if="activeTab === 'parts'" class="space-y-6">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 class="text-xs tracking-widest text-gray-500 uppercase">Component Photography</h3>
                <p class="text-sm text-gray-400 mt-1">Upload detailed images of specific car components for the interactive parts viewer.</p>
              </div>
              <button 
                @click="addPartImage"
                class="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <v-icon icon="mdi-plus" size="14" />
                Add Component
              </button>
            </div>

            <!-- Part Images List -->
            <div v-if="partImages.length === 0" class="border border-white/10 p-12 text-center bg-white/[0.01]">
              <v-icon icon="mdi-camera-off" size="32" class="text-gray-600 mb-3" />
              <p class="text-sm text-gray-500">No component images added yet.</p>
              <p class="text-xs text-gray-600 mt-1">Add photos of engine, wheels, interior, etc.</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="(part, index) in partImages" 
                :key="index"
                class="border border-white/10 bg-white/[0.02] p-4 relative group"
              >
                <div class="flex gap-4">
                  <!-- Part Image Preview -->
                  <div class="w-32 h-24 bg-gray-900 relative overflow-hidden shrink-0 border border-white/10">
                    <img 
                      v-if="part.url"
                      :src="part.url" 
                      class="w-full h-full object-cover"
                      @error="$event.target.src = '/no-image.jpg'"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                      <v-icon icon="mdi-image" size="24" />
                    </div>
                  </div>

                  <!-- Part Details Inputs -->
                  <div class="flex-1 space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-1">Component Name *</label>
                        <select 
                          v-model="part.name"
                          class="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                        >
                          <option value="" class="bg-black text-gray-500">Select part...</option>
                          <optgroup label="Common Parts" class="bg-black text-white">
                            <option value="Engine">Engine</option>
                            <option value="Transmission">Transmission</option>
                            <option value="Wheels">Wheels</option>
                            <option value="Interior">Interior</option>
                            <option value="Headlights">Headlights</option>
                            <option value="Taillights">Taillights</option>
                            <option value="Brakes">Brakes</option>
                            <option value="Exhaust">Exhaust</option>
                            <option value="Suspension">Suspension</option>
                          </optgroup>
                          <optgroup label="Exterior" class="bg-black text-white">
                            <option value="Front View">Front View</option>
                            <option value="Rear View">Rear View</option>
                            <option value="Side Profile">Side Profile</option>
                            <option value="Dashboard">Dashboard</option>
                            <option value="Seats">Seats</option>
                            <option value="Trunk">Trunk / Cargo</option>
                          </optgroup>
                          <optgroup label="Specialized" class="bg-black text-white">
                            <option value="Battery Pack">Battery Pack (EV)</option>
                            <option value="Electric Motor">Electric Motor (EV)</option>
                            <option value="Charging Port">Charging Port (EV)</option>
                            <option value="Truck Bed">Truck Bed</option>
                            <option value="Tow Hitch">Tow Hitch</option>
                            <option value="Sound System">Sound System</option>
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-1">Image URL *</label>
                        <input 
                          v-model="part.url"
                          type="text"
                          class="w-full bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-1">Description</label>
                      <input 
                        v-model="part.description"
                        type="text"
                        class="w-full bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none"
                        placeholder="Brief description of this component's condition..."
                      />
                    </div>
                  </div>

                  <!-- Delete Button -->
                  <button 
                    @click="removePartImage(index)"
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all self-start"
                  >
                    <v-icon icon="mdi-delete" size="14" />
                  </button>
                </div>

             
            </div>

            <!-- Tips -->
            <div class="border border-white/10 bg-white/[0.02] p-4">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-3">Photography Tips</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
                <div class="flex items-start gap-2">
                  <v-icon icon="mdi-check" size="12" class="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Use high-resolution images (min 800x600)</span>
                </div>
                <div class="flex items-start gap-2">
                  <v-icon icon="mdi-check" size="12" class="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Ensure good lighting on component details</span>
                </div>
                <div class="flex items-start gap-2">
                  <v-icon icon="mdi-check" size="12" class="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Capture clean, uncluttered backgrounds</span>
                </div>
                <div class="flex items-start gap-2">
                  <v-icon icon="mdi-check" size="12" class="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Include close-ups of unique features</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-[#0a0a0a]">
          <div class="text-xs text-gray-500">
            <span v-if="activeTab === 'basic'">Step 1 of 3</span>
            <span v-if="activeTab === 'images'">Step 2 of 3</span>
            <span v-if="activeTab === 'parts'">Step 3 of 3 (Optional)</span>
          </div>
          <div class="flex gap-3">
            <button 
              @click="closeDialog"
              class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              Cancel
            </button>
            <button 
              v-if="activeTab !== 'parts'"
              @click="nextTab"
              class="px-8 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium"
            >
              Next
              <v-icon icon="mdi-arrow-right" size="14" class="ml-1" />
            </button>
            <button 
              v-else
              @click="saveCar"
              :disabled="carsStore.loading || !isFormValid"
              class="px-8 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <v-icon v-if="carsStore.loading" icon="mdi-loading" size="16" class="animate-spin" />
              <span v-if="carsStore.loading">Processing...</span>
              <span v-else>{{ isEditing ? 'Update Vehicle' : 'Add to Inventory' }}</span>
              <v-icon v-if="!carsStore.loading" icon="mdi-check" size="14" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" content-class="sharp-dialog">
      <div class="bg-[#0a0a0a] border border-red-500/30 text-white p-8 text-center">
        <div class="w-16 h-16 border border-red-500/30 bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <v-icon icon="mdi-alert" size="32" class="text-red-400" />
        </div>
        <h2 class="text-2xl font-light mb-3">Delete Vehicle?</h2>
        <p class="text-gray-500 text-sm mb-2">
          <span class="text-white font-medium">{{ carToDelete?.brand }} {{ carToDelete?.model }}</span>
        </p>
        <p class="text-gray-500 text-sm mb-8 font-light">
          This action cannot be undone. The vehicle will be permanently removed from inventory.
        </p>
        <div class="flex gap-3 justify-center">
          <button 
            @click="deleteDialog = false"
            class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </button>
          <button 
            @click="deleteCar"
            :disabled="carsStore.loading"
            class="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/30 transition-all disabled:opacity-50"
          >
            <span v-if="carsStore.loading">Deleting...</span>
            <span v-else class="flex items-center gap-2">
              <v-icon icon="mdi-delete" size="14" />
              Delete
            </span>
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarsStore } from '@/stores/cars'
import { useAuthStore } from '@/stores/auth'

const carsStore = useCarsStore()
const authStore = useAuthStore()

// Track editing car ID
const editingCarId = ref(null)
const saveError = ref(null)

// Filters
const searchQuery = ref('')
const filterStatus = ref('All')
const filterCategory = ref('All')

// Dialog states
const carDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const carToDelete = ref(null)

// NEW: Tab system
const tabs = [
  { id: 'basic', name: 'Basic Info', icon: 'mdi-car-info' },
  { id: 'images', name: 'Main Images', icon: 'mdi-image-multiple' },
  { id: 'parts', name: 'Part Images', icon: 'mdi-camera' }
]
const activeTab = ref('basic')

// Form data
const defaultFormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  originalPrice: null,
  mileage: 0,
  fuelType: 'gasoline',
  transmission: 'automatic',
  color: '',
  images: [],
  description: '',
  features: [],
  status: 'available',
  category: 'sedan',
  engine: '',
  horsepower: null,
  partImages: [] // NEW
}

const carFormData = ref({ ...defaultFormData })
const imagesInput = ref('')
const newFeature = ref('')

// NEW: Part images array
const partImages = ref([])

// Computed
const filteredCars = computed(() => {
  let result = [...carsStore.cars]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(car => 
      car.brand?.toLowerCase().includes(query) ||
      car.model?.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value && filterStatus.value !== 'All') {
    result = result.filter(car => 
      car.status?.toLowerCase() === filterStatus.value.toLowerCase()
    )
  }
  
  if (filterCategory.value && filterCategory.value !== 'All') {
    result = result.filter(car => 
      car.category?.toLowerCase() === filterCategory.value.toLowerCase()
    )
  }
  
  return result
})

const imagePreviewList = computed(() => {
  return imagesInput.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
})

const isFormValid = computed(() => {
  return carFormData.value.brand && 
         carFormData.value.model && 
         carFormData.value.year && 
         carFormData.value.price > 0 &&
         carFormData.value.description &&
         imagePreviewList.value.length > 0
})

// Methods
const getStatusClasses = (status) => {
  const classes = {
    available: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    reserved: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
    sold: 'border-red-500/30 text-red-400 bg-red-500/5',
  }
  return classes[status?.toLowerCase()] || 'border-gray-500/30 text-gray-400 bg-gray-500/5'
}

const formatPrice = (price) => price?.toLocaleString('en-US') || '0'

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All'
  filterCategory.value = 'All'
}

const nextTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  if (currentIndex < tabs.length - 1) {
    activeTab.value = tabs[currentIndex + 1].id
  }
}

// NEW: Part image methods
const addPartImage = () => {
  partImages.value.push({
    partId: '',
    name: '',
    url: '',
    description: ''
  })
}

const removePartImage = (index) => {
  partImages.value.splice(index, 1)
}

const openAddDialog = () => {
  isEditing.value = false
  editingCarId.value = null
  carFormData.value = { ...defaultFormData }
  imagesInput.value = ''
  newFeature.value = ''
  partImages.value = [] // Reset part images
  saveError.value = null
  activeTab.value = 'basic'
  carDialog.value = true
}

const openEditDialog = (car) => {
  isEditing.value = true
  editingCarId.value = car.id
  carFormData.value = {
    brand: car.brand || '',
    model: car.model || '',
    year: car.year || new Date().getFullYear(),
    price: car.price || 0,
    originalPrice: car.originalPrice,
    mileage: car.mileage || 0,
    fuelType: car.fuelType || 'gasoline',
    transmission: car.transmission || 'automatic',
    color: car.color || '',
    images: [...(car.images || [])],
    description: car.description || '',
    features: [...(car.features || [])],
    status: car.status || 'available',
    category: car.category || 'sedan',
    engine: car.engine || '',
    horsepower: car.horsepower,
    partImages: [...(car.partImages || [])] // Load existing part images
  }
  imagesInput.value = (car.images || []).join('\n')
  partImages.value = car.partImages ? [...car.partImages] : [] // Populate part images
  newFeature.value = ''
  saveError.value = null
  activeTab.value = 'basic'
  carDialog.value = true
}

const closeDialog = () => {
  carDialog.value = false
  saveError.value = null
}

const confirmDelete = (car) => {
  carToDelete.value = car
  deleteDialog.value = true
}

const addFeature = () => {
  if (newFeature.value.trim()) {
    carFormData.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index) => {
  carFormData.value.features.splice(index, 1)
}

const handleImageError = (event) => {
  event.target.src = '/no-image.jpg'
}

const saveCar = async () => {
  saveError.value = null
  
  if (!isFormValid.value) {
    saveError.value = 'Please fill in all required fields and add at least one main image'
    return
  }

  if (!authStore.isAuthenticated) {
    saveError.value = 'You must be logged in to save vehicles'
    return
  }

  try {
    const images = imagesInput.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    // Clean up part images - COMPUTE partId HERE instead of in template
    const cleanedPartImages = partImages.value
      .filter(p => p.name && p.url) // Only keep parts with name and url
      .map(p => ({
        partId: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), // Generate ID from name
        name: p.name,
        url: p.url,
        description: p.description || ''
      }))

    const carData = {
      ...carFormData.value,
      images: images.length > 0 ? images : ['/no-image.jpg'],
      partImages: cleanedPartImages
    }

    console.log('Saving car with part images:', cleanedPartImages)

    let result
    if (isEditing.value && editingCarId.value) {
      result = await carsStore.updateCar(editingCarId.value, carData, authStore.currentUser?.uid)
    } else {
      result = await carsStore.addCar(carData, authStore.currentUser?.uid)
    }

    if (result) {
      carDialog.value = false
      editingCarId.value = null
      await carsStore.fetchCars()
    } else {
      saveError.value = carsStore.error || 'Failed to save vehicle'
    }
  } catch (error) {
    console.error('Error in saveCar:', error)
    saveError.value = error.message || 'An unexpected error occurred'
  }
}

const deleteCar = async () => {
  if (carToDelete.value) {
    try {
      const success = await carsStore.deleteCar(carToDelete.value.id)
      if (success) {
        deleteDialog.value = false
        carToDelete.value = null
      } else {
        alert(carsStore.error || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      alert(error.message || 'Failed to delete vehicle')
    }
  }
}

onMounted(() => {
  carsStore.fetchCars()
})
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Dialog override - use :deep for Vuetify 3 */
:deep(.v-overlay__content) {
  border-radius: 0 !important;
}

:deep(.v-dialog) {
  border-radius: 0 !important;
}

/* Vuetify overrides */
:deep(.v-icon) {
  border-radius: 0 !important;
}

:deep(.v-img) {
  border-radius: 0 !important;
}

/* Selection */
::selection {
  background: white;
  color: black;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0a0a;
}
::-webkit-scrollbar-thumb {
  background: #333;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Spin animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Input autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Tab transitions */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease;
}
.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}
</style>