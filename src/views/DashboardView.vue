<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Dashboard</span>
            <h1 class="text-4xl lg:text-6xl font-light tracking-tight">
              MY <span class="text-gray-500">DASHBOARD</span>
            </h1>
            <p class="text-gray-400 text-sm mt-3 font-light tracking-wide">
              Welcome back, <span class="text-white">{{ authStore.currentUser?.displayName || 'Guest' }}</span>
            </p>
          </div>
          <router-link 
            to="/cars" 
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-all font-medium group"
          >
            <v-icon icon="mdi-car-search" size="18" class="group-hover:scale-110 transition-transform" />
            Browse Inventory
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-12 border border-white/10">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.title"
          class="bg-black p-6 lg:p-8 hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -mr-10 -mt-10 transition-all group-hover:from-white/[0.05]" />
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                <v-icon :icon="stat.icon" size="18" :class="stat.iconColor" />
              </div>
              <span 
                v-if="stat.trend !== null" 
                class="text-[10px] tracking-wider uppercase"
                :class="stat.trend > 0 ? 'text-emerald-400' : stat.trend < 0 ? 'text-red-400' : 'text-gray-500'"
              >
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
              </span>
            </div>
            <div class="text-3xl lg:text-4xl font-light text-white mb-1 tracking-tight">{{ stat.value }}</div>
            <div class="text-[10px] tracking-[0.2em] text-gray-500 uppercase">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Column -->
        <aside class="w-full lg:w-96 shrink-0 space-y-6">
          
          <!-- Profile Card -->
          <div class="border border-white/10 bg-white/[0.02] overflow-hidden group">
            <div class="h-24 bg-gradient-to-b from-white/[0.05] to-transparent relative">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
            <div class="px-6 pb-6 -mt-12 relative">
              <div class="w-24 h-24 mx-auto mb-4 overflow-hidden bg-gray-900 border-2 border-black relative">
                <v-img
                  :src="authStore.currentUser?.photoURL || 'https://cdn.vuetifyjs.com/images/john.jpg'"
                  cover
                  class="h-full w-full"
                />
                <div class="absolute inset-0 ring-1 ring-white/20" />
              </div>
              
              <div class="text-center">
                <h3 class="text-xl font-light text-white mb-1 tracking-wide">
                  {{ authStore.currentUser?.displayName || 'User' }}
                </h3>
                <p class="text-xs text-gray-500 mb-4 font-light">
                  {{ authStore.currentUser?.email }}
                </p>
                
                <div 
                  class="inline-flex items-center gap-2 px-3 py-1.5 border text-[10px] tracking-[0.2em] uppercase mb-6"
                  :class="authStore.isAdmin ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-white/20 text-gray-400 bg-white/[0.02]'"
                >
                  <v-icon v-if="authStore.isAdmin" icon="mdi-shield" size="12" />
                  {{ authStore.isAdmin ? 'Administrator' : 'Customer' }}
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <router-link 
                    to="/profile"
                    class="py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <v-icon icon="mdi-pencil" size="14" class="group-hover/btn:scale-110 transition-transform" />
                    Edit
                  </router-link>
                  <router-link 
                    to="/settings"
                    class="py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <v-icon icon="mdi-cog" size="14" class="group-hover/btn:scale-110 transition-transform" />
                    Settings
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Status Summary -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Order Status Overview</span>
            </div>
            <div class="p-6 space-y-4">
              <div 
                v-for="status in orderStatusBreakdown" 
                :key="status.label"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2" :class="status.color" />
                  <span class="text-sm text-gray-400">{{ status.label }}</span>
                </div>
                <span class="text-lg font-light text-white">{{ status.count }}</span>
              </div>
              <div class="h-px bg-white/10 my-2" />
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Total Orders</span>
                <span class="text-xl font-light text-white">{{ ordersStore.userOrders.length }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Recent Activity</span>
              <span class="text-[10px] text-gray-600">{{ recentActivity.length }} items</span>
            </div>
            <div class="divide-y divide-white/5 max-h-64 overflow-y-auto">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.id"
                class="px-6 py-4 hover:bg-white/[0.03] transition-colors flex items-start gap-3 cursor-pointer"
                @click="viewOrderById(activity.id)"
              >
                <div 
                  class="w-2 h-2 mt-1.5 shrink-0 rounded-full"
                  :class="activity.color"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-300 truncate">{{ activity.text }}</p>
                  <p class="text-[10px] text-gray-500 mt-0.5">{{ activity.subtext }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ activity.time }}</p>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="px-6 py-8 text-center text-gray-500 text-sm">
                No recent activity
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Quick Links</span>
            </div>
            <div class="divide-y divide-white/5">
              <router-link 
                v-for="link in quickLinks" 
                :key="link.to"
                :to="link.to"
                class="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-all group"
              >
                <div class="flex items-center gap-4">
                  <div 
                    class="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors"
                    :class="link.accent ? 'border-red-500/30' : ''"
                  >
                    <v-icon 
                      :icon="link.icon" 
                      size="16" 
                      :class="link.accent ? 'text-red-400' : 'text-gray-500 group-hover:text-white'" 
                    />
                  </div>
                  <span 
                    class="text-sm tracking-wide transition-colors"
                    :class="link.accent ? 'text-red-400' : 'text-gray-400 group-hover:text-white'"
                  >
                    {{ link.label }}
                  </span>
                  <span 
                    v-if="link.badge" 
                    class="px-2 py-0.5 bg-white text-black text-[10px] font-bold"
                  >
                    {{ link.badge }}
                  </span>
                </div>
                <v-icon 
                  icon="mdi-chevron-right" 
                  size="16" 
                  class="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" 
                />
              </router-link>
            </div>
          </div>
        </aside>

        <!-- Right Column: Orders -->
        <div class="flex-1">
          <div class="border border-white/10 bg-white/[0.02] min-h-[600px]">
            <!-- Orders Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/10 gap-4">
              <div>
                <span class="text-xs tracking-widest text-gray-500 uppercase block mb-1">My Orders & Reservations</span>
                <span class="text-2xl font-light text-white">{{ filteredOrders.length }} <span class="text-gray-500 text-lg">total</span></span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex border border-white/10">
                  <button 
                    v-for="filter in filters" 
                    :key="filter.value"
                    @click="currentFilter = filter.value"
                    class="px-4 py-2 text-xs uppercase tracking-wider transition-all"
                    :class="currentFilter === filter.value ? 'bg-white text-black' : 'text-gray-400 hover:text-white'"
                  >
                    {{ filter.label }}
                  </button>
                </div>
                <router-link 
                  to="/cars" 
                  class="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <v-icon icon="mdi-plus" size="14" />
                  New
                </router-link>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="ordersStore.loading && filteredOrders.length === 0" class="flex justify-center items-center py-32">
              <div class="relative">
                <div class="w-12 h-12 border border-white/20 border-t-white animate-spin" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-6 h-6 border border-white/10 border-t-white/50 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;" />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div 
              v-else-if="filteredOrders.length === 0" 
              class="flex flex-col items-center justify-center py-32 px-6"
            >
              <div class="w-20 h-20 border border-white/10 flex items-center justify-center mb-6">
                <v-icon icon="mdi-clipboard-text-outline" size="32" class="text-gray-600" />
              </div>
              <h2 class="text-2xl font-light mb-2 text-white">No orders found</h2>
              <p class="text-gray-500 text-sm mb-8 font-light text-center max-w-md">
                {{ currentFilter === 'all' ? 'Start browsing our curated inventory and make your first reservation.' : 'No orders match the selected filter.' }}
              </p>
              <router-link 
                to="/cars" 
                class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium"
              >
                Browse Inventory
                <v-icon icon="mdi-arrow-right" size="16" />
              </router-link>
            </div>

            <!-- Orders List -->
            <div v-else class="divide-y divide-white/5">
              <div 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="group"
              >
                <!-- Order Header -->
                <button 
                  @click="toggleOrder(order.id)"
                  class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.03] transition-all"
                >
                  <div class="flex items-center gap-6 flex-1 min-w-0">
                    <div class="flex flex-col items-center w-12 shrink-0">
                      <span class="text-lg font-light text-white">{{ new Date(order.createdAt).getDate() }}</span>
                      <span class="text-[10px] text-gray-500 uppercase">{{ new Date(order.createdAt).toLocaleString('default', { month: 'short' }) }}</span>
                    </div>
                    
                    <div class="h-8 w-px bg-white/10 hidden sm:block" />
                    
                    <div class="flex-1 min-w-0 text-left">
                      <div class="flex items-center gap-3 mb-1">
                        <span class="text-xs font-medium text-white tracking-wider">#{{ order.id.slice(-8).toUpperCase() }}</span>
                        <span 
                          class="px-2 py-0.5 text-[10px] tracking-widest uppercase border"
                          :class="getStatusClasses(order.status)"
                        >
                          {{ order.status }}
                        </span>
                        <span 
                          v-if="order.emailSent"
                          class="text-[10px] text-emerald-400 flex items-center gap-1"
                          title="Confirmation email sent"
                        >
                          <v-icon icon="mdi-email-check" size="10" />
                          Confirmed
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 truncate">
                        {{ order.items.length }} {{ order.items.length === 1 ? 'vehicle' : 'vehicles' }} • {{ order.type }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-6 pl-4">
                    <div class="text-right hidden sm:block">
                      <div class="text-lg font-light text-white">${{ formatPrice(order.totalAmount) }}</div>
                      <div class="text-[10px] text-gray-500 uppercase tracking-wider">Total</div>
                    </div>
                    <div 
                      class="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all"
                      :class="{ 'bg-white text-black': expandedOrders.includes(order.id) }"
                    >
                      <v-icon 
                        icon="mdi-chevron-down" 
                        size="18" 
                        class="transition-transform duration-300"
                        :class="{ 'rotate-180': expandedOrders.includes(order.id) }"
                      />
                    </div>
                  </div>
                </button>

                <!-- Order Details -->
                <div 
                  v-show="expandedOrders.includes(order.id)"
                  class="bg-black/40 border-t border-white/5"
                >
                  <div class="p-6 space-y-4">
                    <!-- Progress Bar -->
                    <div class="mb-6">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-[10px] tracking-widest text-gray-500 uppercase">Order Progress</span>
                        <span class="text-[10px] uppercase" :class="getStatusTextColor(order.status)">{{ getStatusDescription(order.status) }}</span>
                      </div>
                      <div class="h-1 bg-white/10 relative overflow-hidden mb-4">
                        <div 
                          class="h-full transition-all duration-1000 ease-out"
                          :class="getProgressColor(order.status)"
                          :style="{ width: getProgressWidth(order.status) }"
                        />
                      </div>
                      <div class="flex justify-between text-[10px] text-gray-600 uppercase tracking-wider">
                        <div class="flex flex-col items-center gap-1" :class="{ 'text-white': ['pending', 'confirmed', 'processing', 'completed'].includes(order.status) }">
                          <v-icon v-if="['pending', 'confirmed', 'processing', 'completed'].includes(order.status)" icon="mdi-check-circle" size="14" />
                          <span v-else class="w-3.5 h-3.5 border border-gray-600 rounded-full"></span>
                          <span>Pending</span>
                        </div>
                        <div class="flex flex-col items-center gap-1" :class="{ 'text-white': ['confirmed', 'processing', 'completed'].includes(order.status) }">
                          <v-icon v-if="['confirmed', 'processing', 'completed'].includes(order.status)" icon="mdi-check-circle" size="14" />
                          <span v-else class="w-3.5 h-3.5 border border-gray-600 rounded-full"></span>
                          <span>Confirmed</span>
                        </div>
                        <div class="flex flex-col items-center gap-1" :class="{ 'text-white': ['processing', 'completed'].includes(order.status) }">
                          <v-icon v-if="['processing', 'completed'].includes(order.status)" icon="mdi-check-circle" size="14" />
                          <span v-else class="w-3.5 h-3.5 border border-gray-600 rounded-full"></span>
                          <span>Processing</span>
                        </div>
                        <div class="flex flex-col items-center gap-1" :class="{ 'text-white': order.status === 'completed' }">
                          <v-icon v-if="order.status === 'completed'" icon="mdi-check-circle" size="14" />
                          <span v-else class="w-3.5 h-3.5 border border-gray-600 rounded-full"></span>
                          <span>Completed</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between mb-4">
                      <span class="text-[10px] tracking-widest text-gray-500 uppercase">Order Items</span>
                      <span class="text-[10px] text-gray-600">{{ order.items.length }} items</span>
                    </div>
                    
                    <div class="space-y-3">
                      <div 
                        v-for="(item, index) in order.items" 
                        :key="item.car.id"
                        class="flex gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors group/item"
                      >
                        <div class="w-24 h-16 overflow-hidden bg-gray-900 shrink-0 relative">
                          <v-img 
                            :src="item.car.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'" 
                            cover 
                            class="h-full w-full transition-transform duration-500 group-hover/item:scale-105"
                          />
                          <div class="absolute inset-0 ring-1 ring-white/10" />
                        </div>
                        <div class="flex-1 min-w-0 flex flex-col justify-center">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="text-[10px] text-gray-500">{{ item.car.year }}</span>
                            <span class="w-1 h-1 bg-gray-700 rounded-full" />
                            <span class="text-[10px] text-gray-500 uppercase tracking-wider">{{ item.car.category || 'Vehicle' }}</span>
                          </div>
                          <h4 class="text-base font-light text-white truncate mb-1">{{ item.car.brand }} {{ item.car.model }}</h4>
                          <div class="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-wider">
                            <span class="flex items-center gap-1">
                              <v-icon icon="mdi-palette" size="10" />
                              {{ item.car.color || 'N/A' }}
                            </span>
                            <span class="flex items-center gap-1">
                              <v-icon icon="mdi-currency-usd" size="10" />
                              {{ formatPrice(item.car.price) }}
                            </span>
                          </div>
                          <div v-if="item.notes" class="mt-2 text-xs text-gray-600 italic">
                            "{{ item.notes }}"
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Order Meta -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span class="text-[10px] uppercase tracking-wider w-20">Order Type</span>
                          <span class="text-white uppercase tracking-wider">{{ order.type }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span class="text-[10px] uppercase tracking-wider w-20">Status</span>
                          <span :class="getStatusTextColor(order.status)">{{ order.status }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span class="text-[10px] uppercase tracking-wider w-20">Total</span>
                          <span class="text-white font-medium">${{ formatPrice(order.totalAmount) }}</span>
                        </div>
                        <div v-if="order.emailSent" class="flex items-center gap-2 text-xs">
                          <span class="text-[10px] uppercase tracking-wider w-20">Email</span>
                          <span class="text-emerald-400 flex items-center gap-1">
                            <v-icon icon="mdi-check-circle" size="12" />
                            Confirmation sent
                          </span>
                        </div>
                      </div>
                      <div class="flex gap-3 w-full sm:w-auto">
                        <button 
                          v-if="order.status === 'pending'"
                          @click="cancelOrder(order)"
                          class="flex-1 sm:flex-none px-6 py-3 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                        >
                          <v-icon icon="mdi-close" size="14" />
                          Cancel
                        </button>
                        <button 
                          @click="downloadInvoice(order)"
                          class="flex-1 sm:flex-none px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                          <v-icon icon="mdi-download" size="14" />
                          Invoice
                        </button>
                        <button 
                          @click="contactSupport(order)"
                          class="flex-1 sm:flex-none px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <v-icon icon="mdi-headset" size="14" />
                          Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredOrders.length > 0" class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <span class="text-xs text-gray-500">Showing {{ filteredOrders.length }} of {{ ordersStore.userOrders.length }} orders</span>
              <div class="flex gap-2">
                <button 
                  @click="refreshOrders" 
                  class="px-3 py-2 border border-white/10 text-xs uppercase tracking-wider text-gray-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
                  :disabled="isRefreshing"
                >
                  <v-icon icon="mdi-refresh" size="14" :class="{ 'animate-spin': isRefreshing }" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="showOrderDialog" max-width="800" class="sharp-dialog">
      <div v-if="selectedOrder" class="bg-[#0a0a0a] border border-white/20 text-white max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
          <div>
            <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-1">Order Details</span>
            <h2 class="text-2xl font-light">#{{ selectedOrder.id.slice(-8).toUpperCase() }}</h2>
          </div>
          <button 
            @click="showOrderDialog = false" 
            class="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
          >
            <v-icon icon="mdi-close" size="20" class="text-gray-400" />
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Status Badge -->
          <div class="flex items-center gap-4">
            <span 
              class="px-4 py-2 text-xs uppercase tracking-widest border"
              :class="getStatusClasses(selectedOrder.status)"
            >
              {{ selectedOrder.status }}
            </span>
            <span class="text-gray-500 text-sm">Placed on {{ formatDate(selectedOrder.createdAt) }}</span>
          </div>

          <!-- Enhanced Timeline -->
          <div class="border border-white/10 p-6 bg-white/[0.02]">
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-6">Order Timeline</h4>
            <div class="space-y-0">
              <div 
                v-for="(step, index) in getOrderTimeline(selectedOrder)" 
                :key="index"
                class="flex gap-4 relative"
                :class="{ 'pb-8': index !== 3 }"
              >
                <!-- Connector Line -->
                <div v-if="index !== 3" class="absolute left-5 top-10 bottom-0 w-px bg-white/10" :class="{ 'bg-white/30': step.completed }" />
                
                <!-- Icon -->
                <div 
                  class="w-10 h-10 border flex items-center justify-center shrink-0 relative z-10"
                  :class="step.completed ? 'bg-white border-white text-black' : 'border-white/20 text-gray-600 bg-black'"
                >
                  <v-icon v-if="step.completed" icon="mdi-check" size="18" />
                  <span v-else class="text-sm">{{ index + 1 }}</span>
                </div>
                
                <!-- Content -->
                <div class="flex-1 pt-2">
                  <div class="flex items-center justify-between mb-1">
                    <div class="text-sm font-medium" :class="step.completed ? 'text-white' : 'text-gray-500'">{{ step.label }}</div>
                    <div v-if="step.time" class="text-[10px] text-gray-500">{{ step.time }}</div>
                  </div>
                  <div class="text-xs text-gray-600">{{ step.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-white/10 p-4 bg-white/[0.02]">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-3">Customer Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Name</span>
                  <span class="text-white">{{ selectedOrder.customerInfo?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Email</span>
                  <span class="text-white text-xs">{{ selectedOrder.customerInfo?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Phone</span>
                  <span class="text-white">{{ selectedOrder.customerInfo?.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <div class="border border-white/10 p-4 bg-white/[0.02]">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-3">Order Summary</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Type</span>
                  <span class="text-white uppercase">{{ selectedOrder.type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Items</span>
                  <span class="text-white">{{ selectedOrder.items.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Total</span>
                  <span class="text-white font-medium">${{ formatPrice(selectedOrder.totalAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Detail -->
          <div>
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4">Items ({{ selectedOrder.items.length }})</h4>
            <div class="space-y-3">
              <div 
                v-for="item in selectedOrder.items" 
                :key="item.car.id"
                class="flex gap-4 p-4 border border-white/5 bg-white/[0.02]"
              >
                <div class="w-32 h-20 overflow-hidden bg-gray-900 shrink-0 relative">
                  <v-img 
                    :src="item.car.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'" 
                    cover 
                    class="h-full w-full"
                  />
                  <div class="absolute inset-0 ring-1 ring-white/10" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] text-gray-500">{{ item.car.year }}</span>
                    <span class="w-1 h-1 bg-gray-700 rounded-full" />
                    <span class="text-[10px] text-gray-500 uppercase">{{ item.car.brand }}</span>
                  </div>
                  <h4 class="text-lg font-light text-white mb-1">{{ item.car.model }}</h4>
                  <p class="text-xs text-gray-500 mb-2">{{ item.car.color }} • {{ item.car.fuelType }} • {{ item.car.transmission }}</p>
                  <p class="text-sm text-white">${{ formatPrice(item.car.price) }}</p>
                  <div v-if="item.notes" class="mt-2 text-xs text-gray-600 italic border-l-2 border-white/10 pl-3">
                    "{{ item.notes }}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button 
              @click="showOrderDialog = false"
              class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              Close
            </button>
            <button 
              v-if="selectedOrder.status === 'pending'"
              @click="cancelOrder(selectedOrder); showOrderDialog = false"
              class="px-6 py-3 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/10 transition-all"
            >
              Cancel Order
            </button>
            <button 
              @click="contactSupport(selectedOrder)"
              class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
            >
              <v-icon icon="mdi-headset" size="14" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </v-dialog>

    <!-- Toast Notification -->
    <v-snackbar
      v-model="showToast"
      :timeout="3000"
      location="top right"
      class="sharp-snackbar"
    >
      <div class="flex items-center gap-3">
        <v-icon :icon="toastIcon" :color="toastColor" size="20" />
        <span class="text-sm">{{ toastMessage }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const authStore = useAuthStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const expandedOrders = ref([])
const currentFilter = ref('all')
const showOrderDialog = ref(false)
const selectedOrder = ref(null)
const isRefreshing = ref(false)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('mdi-check-circle')
const toastColor = ref('success')

const showNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastIcon.value = type === 'success' ? 'mdi-check-circle' : type === 'error' ? 'mdi-alert-circle' : 'mdi-information'
  toastColor.value = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'
  showToast.value = true
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
]

// Enhanced stats
const stats = computed(() => {
  const orders = ordersStore.userOrders
  const total = orders.length
  const pending = orders.filter(o => o.status === 'pending').length
  const processing = orders.filter(o => o.status === 'processing').length
  const confirmed = orders.filter(o => o.status === 'confirmed').length
  const completed = orders.filter(o => o.status === 'completed').length
  
  return [
    {
      title: 'Total Orders',
      value: total,
      icon: 'mdi-clipboard-list',
      iconColor: 'text-white',
      trend: total > 0 ? orders.filter(o => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length : 0,
    },
    {
      title: 'Pending',
      value: pending,
      icon: 'mdi-clock-outline',
      iconColor: 'text-amber-400',
      trend: pending > 0 && total > 0 ? Math.round((pending / total) * 100) : 0,
    },
    {
      title: 'In Progress',
      value: processing + confirmed,
      icon: 'mdi-refresh',
      iconColor: 'text-blue-400',
      trend: null,
    },
    {
      title: 'Completed',
      value: completed,
      icon: 'mdi-check-circle',
      iconColor: 'text-emerald-400',
      trend: completed > 0 && total > 0 ? Math.round((completed / total) * 100) : 0,
    },
  ]
})

const orderStatusBreakdown = computed(() => [
  { label: 'Pending Approval', count: ordersStore.userOrders.filter(o => o.status === 'pending').length, color: 'bg-amber-400' },
  { label: 'Confirmed', count: ordersStore.userOrders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-400' },
  { label: 'Processing', count: ordersStore.userOrders.filter(o => o.status === 'processing').length, color: 'bg-white' },
  { label: 'Completed', count: ordersStore.userOrders.filter(o => o.status === 'completed').length, color: 'bg-emerald-400' },
  { label: 'Cancelled', count: ordersStore.userOrders.filter(o => o.status === 'cancelled').length, color: 'bg-red-400' },
])

const quickLinks = computed(() => [
  { to: '/cars', icon: 'mdi-car', label: 'Browse Inventory' },
  { to: '/cart', icon: 'mdi-cart', label: 'My Cart', badge: cartStore.itemCount || null },
  ...(authStore.isAdmin ? [{ to: '/admin', icon: 'mdi-shield-account', label: 'Admin Panel', accent: true }] : []),
  { to: '/settings', icon: 'mdi-cog', label: 'Settings' },
])

const recentActivity = computed(() => {
  const activities = []
  
  ordersStore.userOrders.slice(0, 6).forEach(order => {
    const statusColors = {
      pending: 'bg-amber-400',
      confirmed: 'bg-blue-400',
      processing: 'bg-white',
      completed: 'bg-emerald-400',
      cancelled: 'bg-red-400',
    }
    
    const statusLabels = {
      pending: 'Awaiting approval',
      confirmed: 'Order confirmed',
      processing: 'Being processed',
      completed: 'Order completed',
      cancelled: 'Order cancelled',
    }
    
    activities.push({
      id: order.id,
      type: order.type,
      color: statusColors[order.status] || 'bg-gray-400',
      text: `${order.type === 'purchase' ? 'Purchased' : 'Reserved'} ${order.items[0]?.car.brand || 'Vehicle'} ${order.items[0]?.car.model || ''}`,
      subtext: statusLabels[order.status],
      time: formatRelativeTime(order.createdAt),
      status: order.status
    })
  })
  return activities
})

const filteredOrders = computed(() => {
  let orders = [...ordersStore.userOrders]
  
  if (currentFilter.value === 'all') return orders
  if (currentFilter.value === 'active') return orders.filter(o => ['pending', 'processing', 'confirmed'].includes(o.status))
  return orders.filter(o => o.status === currentFilter.value)
})

const toggleOrder = (orderId) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

const viewOrderById = (orderId) => {
  const order = ordersStore.userOrders.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    showOrderDialog.value = true
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDialog.value = true
}

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

const getStatusTextColor = (status) => {
  const colors = {
    pending: 'text-amber-400',
    confirmed: 'text-blue-400',
    processing: 'text-white',
    completed: 'text-emerald-400',
    cancelled: 'text-red-400',
  }
  return colors[status] || 'text-gray-400'
}

const getStatusDescription = (status) => {
  const descriptions = {
    pending: 'Awaiting admin confirmation',
    confirmed: 'Order confirmed by admin',
    processing: 'Preparing your vehicle',
    completed: 'Ready for pickup/delivery',
    cancelled: 'Order cancelled',
  }
  return descriptions[status] || status
}

const getProgressColor = (status) => {
  const colors = {
    pending: 'bg-amber-400',
    confirmed: 'bg-blue-400',
    processing: 'bg-white',
    completed: 'bg-emerald-400',
    cancelled: 'bg-red-400',
  }
  return colors[status] || 'bg-gray-400'
}

const getProgressWidth = (status) => {
  const widths = {
    pending: '15%',
    confirmed: '40%',
    processing: '70%',
    completed: '100%',
    cancelled: '100%',
  }
  return widths[status] || '0%'
}

const getOrderTimeline = (order) => {
  return [
    { 
      label: 'Order Placed', 
      completed: true, 
      time: formatDate(order.createdAt),
      description: 'Your order has been received and is awaiting review'
    },
    { 
      label: 'Confirmed', 
      completed: ['confirmed', 'processing', 'completed'].includes(order.status),
      time: order.confirmedAt ? formatDate(order.confirmedAt) : null,
      description: 'Admin has approved and confirmed your order'
    },
    { 
      label: 'Processing', 
      completed: ['processing', 'completed'].includes(order.status),
      time: order.processingAt ? formatDate(order.processingAt) : null,
      description: 'Preparing documentation, cleaning, and inspection'
    },
    { 
      label: 'Completed', 
      completed: order.status === 'completed',
      time: order.completedAt ? formatDate(order.completedAt) : null,
      description: 'Vehicle is ready for pickup or delivery scheduled'
    },
  ]
}

const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('en-US')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeTime = (date) => {
  if (!date) return 'Unknown'
  const now = new Date()
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'
  
  const diff = now - d
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 5) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(date)
}

const refreshOrders = async () => {
  isRefreshing.value = true
  if (authStore.currentUser) {
    await ordersStore.fetchUserOrders(authStore.currentUser.uid)
  }
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

const downloadInvoice = (order) => {
  console.log('Downloading invoice for order:', order.id)
  // Implement PDF generation here
  showNotification('Invoice download coming soon!', 'info')
}

const contactSupport = (order) => {
  const subject = `Order Inquiry #${order.id.slice(-8).toUpperCase()}`
  const body = `Hello Support Team,%0D%0A%0D%0AI have a question about my order #${order.id.slice(-8).toUpperCase()}.%0D%0A%0D%0ACurrent Status: ${order.status}%0D%0ATotal Amount: $${formatPrice(order.totalAmount)}%0D%0A%0D%0APlease assist me with this matter.%0D%0A%0D%0AThank you.`
  window.location.href = `mailto:support@autolux.com?subject=${subject}&body=${body}`
}

const cancelOrder = async (order) => {
  if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return
  
  try {
    const success = await ordersStore.updateOrderStatus(order.id, 'cancelled')
    if (success) {
      showNotification('Order cancelled successfully', 'success')
      // Close dialog if open
      if (showOrderDialog.value && selectedOrder.value?.id === order.id) {
        showOrderDialog.value = false
      }
    } else {
      showNotification('Failed to cancel order', 'error')
    }
  } catch (err) {
    showNotification('Error cancelling order', 'error')
  }
}

// Real-time subscription
let unsubscribe = null

onMounted(async () => {
  cartStore.loadFromLocalStorage()
  
  if (authStore.currentUser) {
    // Use real-time subscription
    unsubscribe = ordersStore.subscribeToUserOrders(authStore.currentUser.uid)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
  ordersStore.unsubscribeAll()
})

// Watch for auth changes
watch(() => authStore.currentUser, async (newUser, oldUser) => {
  if (newUser && newUser.uid !== oldUser?.uid) {
    if (unsubscribe) unsubscribe()
    unsubscribe = ordersStore.subscribeToUserOrders(newUser.uid)
  } else if (!newUser && oldUser) {
    if (unsubscribe) unsubscribe()
    ordersStore.userOrders = []
  }
})
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Vuetify overrides */
:deep(.v-img) {
  border-radius: 0 !important;
}

:deep(.v-icon) {
  border-radius: 0 !important;
}

:deep(.v-dialog) {
  border-radius: 0 !important;
}

:deep(.v-overlay__content) {
  border-radius: 0 !important;
}

:deep(.v-snackbar__wrapper) {
  border-radius: 0 !important;
}

/* Selection */
::selection {
  background: white;
  color: black;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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

/* Carbon fiber texture overlay */
.bg-carbon {
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
}
</style>