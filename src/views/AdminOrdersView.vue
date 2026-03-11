<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 bg-gradient-to-r from-red-950/20 via-black to-black relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 border border-red-500/30 bg-red-500/10 flex items-center justify-center shrink-0">
              <v-icon icon="mdi-clipboard-list" size="28" class="text-red-400" />
            </div>
            <div>
              <span class="text-xs tracking-[0.3em] text-red-400 uppercase block mb-2">Order Management</span>
              <h1 class="text-3xl lg:text-5xl font-light tracking-tight">
                MANAGE <span class="text-gray-500">ORDERS</span>
              </h1>
              <p class="text-gray-400 text-sm mt-2 font-light">
                {{ filteredOrders.length }} orders in system
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <button 
              @click="showCreateDialog = true"
              class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
            >
              <v-icon icon="mdi-plus" size="16" />
              Create Order
            </button>
            <router-link 
              to="/admin" 
              class="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              <v-icon icon="mdi-arrow-left" size="14" />
              Back to Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-6 border border-white/10">
        <div 
          v-for="stat in orderStats" 
          :key="stat.title"
          class="bg-black p-6 hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -mr-10 -mt-10 transition-all group-hover:from-white/[0.05]" />
          
          <div class="relative z-10">
            <div class="text-3xl font-light mb-1" :class="stat.textColor">{{ stat.value }}</div>
            <div class="text-[10px] tracking-[0.2em] text-gray-500 uppercase">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="border border-white/10 bg-white/[0.02] p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 relative">
            <v-icon icon="mdi-magnify" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search by order ID or customer..."
              class="w-full bg-transparent border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
          
          <div class="flex gap-4 flex-col sm:flex-row">
            <select 
              v-model="filterStatus"
              class="bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none transition-colors w-full sm:min-w-[140px]"
            >
              <option value="All" class="bg-black">All Status</option>
              <option value="Pending" class="bg-black">Pending</option>
              <option value="Confirmed" class="bg-black">Confirmed</option>
              <option value="Processing" class="bg-black">Processing</option>
              <option value="Completed" class="bg-black">Completed</option>
              <option value="Cancelled" class="bg-black">Cancelled</option>
            </select>
            
            <select 
              v-model="filterType"
              class="bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none transition-colors w-full sm:min-w-[140px]"
            >
              <option value="All" class="bg-black">All Types</option>
              <option value="Purchase" class="bg-black">Purchase</option>
              <option value="Reservation" class="bg-black">Reservation</option>
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

      <!-- Orders Table -->
      <div v-if="ordersStore.loading" class="flex justify-center items-center py-32">
        <div class="relative">
          <div class="w-12 h-12 border border-white/20 border-t-white animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-6 border border-white/10 border-t-white/50 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="border border-white/10 p-20 text-center">
        <div class="w-20 h-20 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <v-icon icon="mdi-clipboard-off" size="32" class="text-gray-600" />
        </div>
        <h2 class="text-2xl font-light mb-3">No orders found</h2>
        <p class="text-gray-500 text-sm font-light">
          {{ searchQuery || filterStatus !== 'All' || filterType !== 'All' ? 'Try adjusting your filters' : 'No orders in the system yet' }}
        </p>
      </div>

      <div v-else class="border border-white/10 bg-white/[0.02] overflow-hidden">
        <!-- RESPONSIVE FIX: Scroll wrapper -->
        <div class="overflow-x-auto">
          <div class="min-w-[900px]">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.03] text-[10px] tracking-widest text-gray-500 uppercase items-center">
              <div class="col-span-2">Order ID</div>
              <div class="col-span-3">Customer</div>
              <div class="col-span-1 text-center">Items</div>
              <div class="col-span-2">Amount</div>
              <div class="col-span-2">Status</div>
              <div class="col-span-1">Type</div>
              <div class="col-span-1 text-right">Actions</div>
            </div>

            <!-- Table Rows -->
            <div class="divide-y divide-white/5">
              <div 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors group"
              >
                <!-- Order ID -->
                <div class="col-span-2">
                  <span class="text-sm font-medium text-white tracking-wider">#{{ order.id.slice(-8).toUpperCase() }}</span>
                  <div class="text-[10px] text-gray-500 mt-1">{{ formatDateShort(order.createdAt) }}</div>
                </div>

                <!-- Customer -->
                <div class="col-span-3 min-w-0">
                  <h3 class="text-sm font-medium text-white truncate">{{ order.customerInfo.name }}</h3>
                  <p class="text-xs text-gray-500 truncate">{{ order.customerInfo.email }}</p>
                </div>

                <!-- Items -->
                <div class="col-span-1 text-center">
                  <span class="inline-flex items-center justify-center w-8 h-8 border border-white/10 text-xs text-white">
                    {{ order.items.length }}
                  </span>
                </div>

                <!-- Amount -->
                <div class="col-span-2">
                  <span class="text-lg font-light text-white">${{ formatPrice(order.totalAmount) }}</span>
                </div>

                <!-- Status Dropdown -->
                <div class="col-span-2 relative">
                  <div class="relative">
                    <button 
                      @click="toggleStatusMenu(order.id)"
                      class="w-full flex items-center justify-between px-3 py-2 border text-xs uppercase tracking-wider transition-all"
                      :class="getStatusClasses(order.status)"
                    >
                      <span>{{ order.status }}</span>
                      <v-icon icon="mdi-chevron-down" size="14" :class="{ 'rotate-180': openStatusMenu === order.id }" />
                    </button>
                    
                    <!-- Status Dropdown Menu -->
                    <div 
                      v-if="openStatusMenu === order.id"
                      class="absolute top-full left-0 right-0 mt-1 bg-[#0a0a0a] border border-white/20 z-50 shadow-2xl"
                    >
                      <button 
                        v-for="status in statuses" 
                        :key="status"
                        @click="updateStatus(order.id, status)"
                        class="w-full px-3 py-2 text-left text-xs uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2"
                        :class="order.status === status ? 'text-white bg-white/5' : 'text-gray-400'"
                      >
                        <span 
                          class="w-2 h-2"
                          :class="getStatusDotColor(status)"
                        />
                        {{ status }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Type -->
                <div class="col-span-1">
                  <span 
                    class="text-[10px] uppercase tracking-wider"
                    :class="order.type === 'purchase' ? 'text-emerald-400' : 'text-blue-400'"
                  >
                    {{ order.type }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="col-span-1 flex items-center justify-end">
                  <button 
                    @click="viewOrder(order)"
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
                    title="View Details"
                  >
                    <v-icon icon="mdi-eye" size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END RESPONSIVE FIX -->

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span class="text-xs text-gray-500">
            Showing {{ filteredOrders.length }} of {{ ordersStore.orders.length }} orders
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

    <!-- Create Order Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="900" class="sharp-dialog">
      <div class="bg-[#0a0a0a] border border-white/20 text-white max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
          <div>
            <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-1">New Order</span>
            <h2 class="text-2xl font-light">Create Reservation / Purchase</h2>
          </div>
          <button 
            @click="closeCreateDialog" 
            class="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all"
          >
            <v-icon icon="mdi-close" size="20" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Order Type Selection -->
          <div>
            <label class="text-[10px] tracking-widest text-gray-500 uppercase block mb-3">Order Type</label>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="newOrder.type = 'reservation'"
                class="p-4 border text-left transition-all"
                :class="newOrder.type === 'reservation' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'"
              >
                <v-icon icon="mdi-calendar-clock" size="24" class="mb-2" :class="newOrder.type === 'reservation' ? 'text-blue-400' : 'text-gray-600'" />
                <div class="text-sm font-medium mb-1">Reservation</div>
                <div class="text-[10px] opacity-70">7-day hold with $500 deposit</div>
              </button>
              <button
                @click="newOrder.type = 'purchase'"
                class="p-4 border text-left transition-all"
                :class="newOrder.type === 'purchase' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'"
              >
                <v-icon icon="mdi-currency-usd" size="24" class="mb-2" :class="newOrder.type === 'purchase' ? 'text-emerald-400' : 'text-gray-600'" />
                <div class="text-sm font-medium mb-1">Direct Purchase</div>
                <div class="text-[10px] opacity-70">Immediate sale processing</div>
              </button>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="border border-white/10 p-5 bg-white/[0.02]">
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
              <v-icon icon="mdi-account" size="14" />
              Customer Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Full Name *</label>
                <input 
                  v-model="newOrder.customerInfo.name"
                  type="text"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Email *</label>
                <input 
                  v-model="newOrder.customerInfo.email"
                  type="email"
                  :class="{ 'border-red-400': emailError }"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
                <span v-if="emailError" class="text-[10px] text-red-400 mt-1 block">{{ emailError }}</span>
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Phone *</label>
                <input 
                  v-model="newOrder.customerInfo.phone"
                  type="tel"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div class="md:col-span-2">
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Address *</label>
                <textarea 
                  v-model="newOrder.customerInfo.address"
                  rows="2"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="123 Luxury Lane, Beverly Hills, CA 90210"
                />
              </div>
            </div>
          </div>

          <!-- Vehicle Selection -->
          <div class="border border-white/10 p-5 bg-white/[0.02]">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xs tracking-widest text-gray-500 uppercase flex items-center gap-2">
                <v-icon icon="mdi-car" size="14" />
                Select Vehicles
              </h4>
              <span class="text-[10px] text-gray-500">{{ newOrder.items.length }} selected</span>
            </div>

            <!-- Available Cars List -->
            <div v-if="availableCars.length === 0" class="text-center py-8 text-gray-500 text-sm">
              <div v-if="loadingCars" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border border-white/20 border-t-white animate-spin" />
                Loading available cars...
              </div>
              <div v-else>No available cars found</div>
            </div>
            
            <div v-else class="space-y-2 max-h-64 overflow-y-auto border border-white/10 p-2">
              <div 
                v-for="car in availableCars" 
                :key="car.id"
                @click="toggleCarSelection(car)"
                class="flex items-center gap-4 p-3 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                :class="{ 'bg-white/10 border-white/30': isCarSelected(car.id) }"
              >
                <div class="w-16 h-12 overflow-hidden bg-gray-900 shrink-0">
                  <v-img :src="car.images?.[0]" cover class="h-full w-full" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-white truncate">{{ car.brand }} {{ car.model }}</div>
                  <div class="text-[10px] text-gray-500">{{ car.year }} • {{ car.color }} • ${{ car.price?.toLocaleString() }}</div>
                </div>
                <div 
                  class="w-6 h-6 border flex items-center justify-center transition-all"
                  :class="isCarSelected(car.id) ? 'bg-white border-white text-black' : 'border-white/20'"
                >
                  <v-icon v-if="isCarSelected(car.id)" icon="mdi-check" size="14" />
                </div>
              </div>
            </div>

            <!-- Selected Cars Summary -->
            <div v-if="newOrder.items.length > 0" class="mt-4 pt-4 border-t border-white/10">
              <div class="text-[10px] tracking-widest text-gray-500 uppercase mb-2">Selected Vehicles</div>
              <div class="space-y-2">
                <div 
                  v-for="(item, index) in newOrder.items" 
                  :key="index"
                  class="flex items-center justify-between p-3 bg-white/5 border border-white/10"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-500">{{ index + 1 }}.</span>
                    <span class="text-sm text-white">{{ item.car.brand }} {{ item.car.model }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-white">${{ item.car.price?.toLocaleString() }}</span>
                    <button 
                      @click="removeCarFromSelection(index)"
                      class="w-6 h-6 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                      <v-icon icon="mdi-close" size="12" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Total -->
              <div class="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span class="text-sm text-gray-400">Total Amount</span>
                <span class="text-2xl font-light text-white">${{ calculateTotal().toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Admin Notes -->
          <div>
            <label class="text-[10px] tracking-widest text-gray-500 uppercase block mb-2">Admin Notes (Optional)</label>
            <textarea 
              v-model="newOrder.adminNotes"
              rows="2"
              class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none"
              placeholder="Internal notes about this order..."
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-[#0a0a0a]">
          <button 
            @click="closeCreateDialog"
            class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </button>
          <button 
            @click="submitNewOrder"
            :disabled="!isFormValid || isSubmitting"
            class="px-8 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <v-icon v-if="isSubmitting" icon="mdi-loading" class="animate-spin" size="14" />
            <span v-else>Create Order</span>
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- Order Details Dialog -->
    <v-dialog v-model="orderDialog" max-width="800" class="sharp-dialog">
      <div v-if="selectedOrder" class="bg-[#0a0a0a] border border-white/20 text-white max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
          <div class="flex items-center gap-4">
            <div>
              <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-1">Order Details</span>
              <h2 class="text-2xl font-light">#{{ selectedOrder.id.slice(-8).toUpperCase() }}</h2>
            </div>
            <span 
              class="px-3 py-1 text-[10px] tracking-widest uppercase border"
              :class="getStatusClasses(selectedOrder.status)"
            >
              {{ selectedOrder.status }}
            </span>
          </div>
          <button 
            @click="orderDialog = false" 
            class="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all"
          >
            <v-icon icon="mdi-close" size="20" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Customer & Order Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-white/10 p-5 bg-white/[0.02]">
              <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
                <v-icon icon="mdi-account" size="14" />
                Customer Information
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">Name</span>
                  <span class="text-white">{{ selectedOrder.customerInfo.name }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">Email</span>
                  <span class="text-white text-xs">{{ selectedOrder.customerInfo.email }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">Phone</span>
                  <span class="text-white">{{ selectedOrder.customerInfo.phone }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Address</span>
                  <span class="text-white text-xs text-right max-w-[200px]">{{ selectedOrder.customerInfo.address }}</span>
                </div>
              </div>
            </div>

            <div class="border border-white/10 p-5 bg-white/[0.02]">
              <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
                <v-icon icon="mdi-information" size="14" />
                Order Information
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">Type</span>
                  <span 
                    class="text-xs uppercase tracking-wider"
                    :class="selectedOrder.type === 'purchase' ? 'text-emerald-400' : 'text-blue-400'"
                  >
                    {{ selectedOrder.type }}
                  </span>
                </div>
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">Date</span>
                  <span class="text-white text-xs">{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span class="text-gray-500">User ID</span>
                  <span class="text-white text-xs font-mono">{{ selectedOrder.userId.slice(-8) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Items</span>
                  <span class="text-white">{{ selectedOrder.items.length }} vehicles</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-white/10 pb-2">
              Order Items ({{ selectedOrder.items.length }})
            </h4>
            <div class="space-y-3">
              <div 
                v-for="item in selectedOrder.items" 
                :key="item.car.id"
                class="flex gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
              >
                <div class="w-24 h-16 overflow-hidden bg-gray-900 shrink-0 relative">
                  <v-img 
                    :src="item.car.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'" 
                    cover 
                    class="h-full w-full"
                  />
                  <div class="absolute inset-0 ring-1 ring-white/10" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] text-gray-500">{{ item.car.year }}</span>
                        <span class="w-1 h-1 bg-gray-700 rounded-full" />
                        <span class="text-[10px] text-gray-500 uppercase">{{ item.car.brand }}</span>
                      </div>
                      <h4 class="text-base font-light text-white mb-1">{{ item.car.model }}</h4>
                      <div class="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-wider">
                        <span class="flex items-center gap-1">
                          <v-icon icon="mdi-palette" size="10" />
                          {{ item.car.color }}
                        </span>
                        <span class="flex items-center gap-1">
                          <v-icon icon="mdi-gas-station" size="10" />
                          {{ item.car.fuelType }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-light text-white">${{ formatPrice(item.car.price) }}</div>
                    </div>
                  </div>
                  <div v-if="item.notes" class="mt-3 pt-3 border-t border-white/5">
                    <p class="text-xs text-gray-500 italic">"{{ item.notes }}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border border-white/10 p-5 bg-white/[0.02]">
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4">Order Summary</h4>
            <div class="space-y-2 max-w-xs ml-auto">
              <div class="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>${{ formatPrice(selectedOrder.totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-400">
                <span>Tax (8%)</span>
                <span>${{ formatPrice(selectedOrder.totalAmount * 0.08) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-400">
                <span>Processing</span>
                <span>$199</span>
              </div>
              <div class="h-px bg-white/10 my-3" />
              <div class="flex justify-between text-lg font-light text-white">
                <span>Total</span>
                <span>${{ formatPrice(selectedOrder.totalAmount + selectedOrder.totalAmount * 0.08 + 199) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-[#0a0a0a]">
          <button 
            @click="orderDialog = false"
            class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Close
          </button>
          
          <!-- Status Action Buttons -->
          <button 
            v-if="selectedOrder.status === 'pending'"
            @click="updateStatus(selectedOrder.id, 'confirmed')"
            class="px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs uppercase tracking-wider hover:bg-blue-500/30 transition-all flex items-center gap-2"
          >
            <v-icon icon="mdi-check" size="14" />
            Confirm Order
          </button>
          
          <button 
            v-if="selectedOrder.status === 'confirmed'"
            @click="updateStatus(selectedOrder.id, 'processing')"
            class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
          >
            <v-icon icon="mdi-refresh" size="14" />
            Process Order
          </button>
          
          <button 
            v-if="selectedOrder.status === 'processing'"
            @click="updateStatus(selectedOrder.id, 'completed')"
            class="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-wider hover:bg-emerald-500/30 transition-all flex items-center gap-2"
          >
            <v-icon icon="mdi-check-circle" size="14" />
            Complete Order
          </button>
          
          <button 
            v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
            @click="updateStatus(selectedOrder.id, 'cancelled')"
            class="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <v-icon icon="mdi-close" size="14" />
            Cancel
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'

const ordersStore = useOrdersStore()
const authStore = useAuthStore()

// Filters
const searchQuery = ref('')
const filterStatus = ref('All')
const filterType = ref('All')

// Dialog
const orderDialog = ref(false)
const selectedOrder = ref(null)
const openStatusMenu = ref(null)
const statuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled']

// Create Order State
const showCreateDialog = ref(false)
const isSubmitting = ref(false)
const loadingCars = ref(false)
const emailError = ref('')
const availableCars = ref([])

const newOrder = ref({
  type: 'reservation',
  customerInfo: {
    name: '',
    email: '',
    phone: '',
    address: ''
  },
  items: [],
  adminNotes: ''
})

// Fetch available cars for selection
const fetchAvailableCars = async () => {
  loadingCars.value = true
  try {
    const q = query(collection(db, 'cars'), where('status', '==', 'available'))
    const snapshot = await getDocs(q)
    availableCars.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Failed to fetch cars:', err)
  } finally {
    loadingCars.value = false
  }
}

// Check if car is selected
const isCarSelected = (carId) => {
  return newOrder.value.items.some(item => item.car.id === carId)
}

// Toggle car selection
const toggleCarSelection = (car) => {
  const index = newOrder.value.items.findIndex(item => item.car.id === car.id)
  if (index > -1) {
    newOrder.value.items.splice(index, 1)
  } else {
    newOrder.value.items.push({
      car: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        images: car.images || [],
        color: car.color || '',
        fuelType: car.fuelType || '',
        transmission: car.transmission || '',
        mileage: car.mileage || 0
      },
      quantity: 1,
      notes: ''
    })
  }
}

// Remove car from selection
const removeCarFromSelection = (index) => {
  newOrder.value.items.splice(index, 1)
}

// Calculate total
const calculateTotal = () => {
  return newOrder.value.items.reduce((sum, item) => sum + (item.car.price || 0), 0)
}

// Validate email
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Form validation
const isFormValid = computed(() => {
  const info = newOrder.value.customerInfo
  return info.name.trim() && 
         info.email.trim() && 
         validateEmail(info.email) &&
         info.phone.trim() && 
         info.address.trim() &&
         newOrder.value.items.length > 0
})

// Close create dialog
const closeCreateDialog = () => {
  showCreateDialog.value = false
  resetNewOrder()
}

// Reset form
const resetNewOrder = () => {
  newOrder.value = {
    type: 'reservation',
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [],
    adminNotes: ''
  }
  emailError.value = ''
}

// Submit new order
const submitNewOrder = async () => {
  if (!isFormValid.value) return
  
  // Validate email
  if (!validateEmail(newOrder.value.customerInfo.email)) {
    emailError.value = 'Please enter a valid email'
    return
  }
  emailError.value = ''

  isSubmitting.value = true
  
  try {
    // Use admin's user ID
    const adminUserId = authStore.currentUser?.uid || 'admin-system'
    
    const result = await ordersStore.createOrder(
      adminUserId,
      newOrder.value.items,
      newOrder.value.customerInfo,
      newOrder.value.type,
      newOrder.value.customerInfo.email,
      newOrder.value.customerInfo.name
    )

    if (result) {
      console.log('✅ Order created successfully:', result.id)
      closeCreateDialog()
      // Refresh orders list
      await ordersStore.fetchAllOrders()
    } else {
      throw new Error(ordersStore.error || 'Failed to create order')
    }
  } catch (err) {
    console.error('Failed to create order:', err)
    alert('Failed to create order: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

// Watch for dialog open to fetch cars
watch(showCreateDialog, (isOpen) => {
  if (isOpen) {
    fetchAvailableCars()
  }
})

// Computed
const orderStats = computed(() => [
  {
    title: 'Total Orders',
    value: ordersStore.orders.length,
    textColor: 'text-white',
  },
  {
    title: 'Pending',
    value: ordersStore.orders.filter(o => o.status === 'pending').length,
    textColor: 'text-amber-400',
  },
  {
    title: 'Processing',
    value: ordersStore.orders.filter(o => o.status === 'processing').length,
    textColor: 'text-blue-400',
  },
  {
    title: 'Completed',
    value: ordersStore.orders.filter(o => o.status === 'completed').length,
    textColor: 'text-emerald-400',
  },
])

const filteredOrders = computed(() => {
  let result = [...ordersStore.orders]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customerInfo.name.toLowerCase().includes(query) ||
      order.customerInfo.email.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value && filterStatus.value !== 'All') {
    result = result.filter(order => 
      order.status.toLowerCase() === filterStatus.value.toLowerCase()
    )
  }
  
  if (filterType.value && filterType.value !== 'All') {
    result = result.filter(order => 
      order.type.toLowerCase() === filterType.value.toLowerCase()
    )
  }
  
  return result
})

// Methods
const getStatusClasses = (status) => {
  const classes = {
    pending: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
    confirmed: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
    processing: 'border-white/30 text-white bg-white/5',
    completed: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    cancelled: 'border-red-500/30 text-red-400 bg-red-500/5',
  }
  return classes[status] || 'border-gray-500/30 text-gray-400 bg-gray-500/5'
}

const getStatusDotColor = (status) => {
  const colors = {
    pending: 'bg-amber-400',
    confirmed: 'bg-blue-400',
    processing: 'bg-white',
    completed: 'bg-emerald-400',
    cancelled: 'bg-red-400',
  }
  return colors[status] || 'bg-gray-400'
}

const formatPrice = (price) => price?.toLocaleString('en-US') || '0'

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All'
  filterType.value = 'All'
}

const toggleStatusMenu = (orderId) => {
  openStatusMenu.value = openStatusMenu.value === orderId ? null : orderId
}

const viewOrder = (order) => {
  selectedOrder.value = order
  orderDialog.value = true
}

const updateStatus = async (orderId, status) => {
  await ordersStore.updateOrderStatus(orderId, status)
  openStatusMenu.value = null
  if (selectedOrder.value && selectedOrder.value.id === orderId) {
    selectedOrder.value.status = status
  }
}

// Close status menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    openStatusMenu.value = null
  }
}

onMounted(() => {
  ordersStore.fetchAllOrders()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Dialog override */
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

/* Rotate animation */
.rotate-180 {
  transform: rotate(180deg);
}
</style>