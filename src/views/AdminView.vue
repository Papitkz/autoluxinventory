<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 bg-gradient-to-r from-red-950/20 via-black to-black relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 border border-red-500/30 bg-red-500/10 flex items-center justify-center shrink-0">
              <v-icon icon="mdi-shield-account" size="32" class="text-red-400" />
            </div>
            <div>
              <span class="text-xs tracking-[0.3em] text-red-400 uppercase block mb-2">Administration</span>
              <h1 class="text-4xl lg:text-6xl font-light tracking-tight">
                ADMIN <span class="text-gray-500">CONTROL</span>
              </h1>
              <p class="text-gray-400 text-sm mt-2 font-light tracking-wide">
                Manage inventory, orders, and system operations
              </p>
            </div>
          </div>
          <router-link 
            to="/" 
            class="inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <v-icon icon="mdi-home" size="16" class="group-hover:-translate-y-0.5 transition-transform" />
            Back to Site
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-12 border border-white/10">
        <div 
          v-for="stat in adminStats" 
          :key="stat.title"
          class="bg-black p-6 lg:p-8 hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -mr-12 -mt-12 transition-all group-hover:from-white/[0.05]" />
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div 
                class="w-12 h-12 border flex items-center justify-center transition-colors"
                :class="stat.borderColor"
              >
                <v-icon :icon="stat.icon" size="20" :class="stat.iconColor" />
              </div>
              <span 
                v-if="stat.change !== undefined" 
                class="text-[10px] tracking-wider uppercase flex items-center gap-1"
                :class="stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >
                <v-icon :icon="stat.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'" size="12" />
                {{ Math.abs(stat.change) }}%
              </span>
            </div>
            <div class="text-3xl lg:text-4xl font-light text-white mb-1 tracking-tight">{{ stat.value }}</div>
            <div class="text-[10px] tracking-[0.2em] text-gray-500 uppercase">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <span class="text-xs tracking-widest text-gray-500 uppercase">Quick Actions</span>
          <div class="h-px flex-1 bg-white/10 ml-6" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link 
            v-for="action in quickActions" 
            :key="action.title"
            :to="action.to"
            class="group border border-white/10 bg-white/[0.02] p-6 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div class="relative z-10">
              <div 
                class="w-14 h-14 border flex items-center justify-center mb-4 transition-all group-hover:scale-105"
                :class="action.borderColor"
              >
                <v-icon :icon="action.icon" size="28" :class="action.iconColor" />
              </div>
              <h4 class="text-lg font-light text-white mb-1 tracking-wide group-hover:text-white transition-colors">{{ action.title }}</h4>
              <p class="text-xs text-gray-500 font-light">{{ action.description }}</p>
              
              <div class="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 group-hover:text-gray-400 transition-colors">
                <span>Access</span>
                <v-icon icon="mdi-arrow-right" size="12" class="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="flex flex-col xl:flex-row gap-8">
        
        <!-- Recent Orders -->
        <div class="flex-1">
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <span class="text-xs tracking-widest text-gray-500 uppercase block mb-1">Recent Orders</span>
                <span class="text-2xl font-light text-white">{{ recentOrders.length }} <span class="text-gray-500 text-lg">latest</span></span>
              </div>
              <router-link 
                to="/admin/orders" 
                class="px-4 py-2 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
              >
                View All
              </router-link>
            </div>

            <div v-if="ordersStore.loading" class="flex justify-center items-center py-20">
              <div class="w-10 h-10 border border-white/20 border-t-white animate-spin" />
            </div>

            <div v-else-if="recentOrders.length === 0" class="p-12 text-center">
              <v-icon icon="mdi-clipboard-text-outline" size="48" class="text-gray-700 mb-4" />
              <p class="text-gray-500 text-sm">No orders found</p>
            </div>

            <div v-else class="divide-y divide-white/5">
              <div 
                v-for="order in recentOrders" 
                :key="order.id"
                class="px-6 py-4 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                @click="viewOrder(order)"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="flex flex-col items-center w-10 shrink-0">
                      <span class="text-base font-light text-white">{{ new Date(order.createdAt).getDate() }}</span>
                      <span class="text-[10px] text-gray-500 uppercase">{{ new Date(order.createdAt).toLocaleString('default', { month: 'short' }) }}</span>
                    </div>
                    
                    <div class="h-8 w-px bg-white/10" />
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium text-white tracking-wider">#{{ order.id.slice(-8).toUpperCase() }}</span>
                        <span 
                          class="px-2 py-0.5 text-[10px] tracking-widest uppercase border"
                          :class="getStatusClasses(order.status)"
                        >
                          {{ order.status }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 truncate">
                        {{ order.items.length }} {{ order.items.length === 1 ? 'vehicle' : 'vehicles' }} • {{ order.customerInfo?.name || 'Unknown' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="text-right hidden sm:block">
                      <div class="text-lg font-light text-white">${{ formatPrice(order.totalAmount) }}</div>
                    </div>
                    <div class="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                      <v-icon icon="mdi-eye" size="16" class="text-gray-500 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Cars -->
        <div class="w-full xl:w-96 shrink-0">
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <span class="text-xs tracking-widest text-gray-500 uppercase block mb-1">Inventory</span>
                <span class="text-2xl font-light text-white">{{ recentCars.length }} <span class="text-gray-500 text-lg">recent</span></span>
              </div>
              <router-link 
                to="/admin/cars" 
                class="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                View All
              </router-link>
            </div>

            <div v-if="carsStore.loading" class="flex justify-center items-center py-12">
              <div class="w-8 h-8 border border-white/20 border-t-white animate-spin" />
            </div>

            <div v-else class="divide-y divide-white/5">
              <router-link 
                v-for="car in recentCars" 
                :key="car.id"
                :to="`/cars/${car.id}`"
                class="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors group"
              >
                <div class="w-16 h-12 overflow-hidden bg-gray-900 shrink-0 relative">
                  <v-img 
                    :src="car.images?.[0] || 'https://via.placeholder.com/60x45?text=No+Image'" 
                    cover 
                    class="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 ring-1 ring-white/10" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-[10px] text-gray-500">{{ car.year }}</span>
                    <span class="w-1 h-1 bg-gray-700 rounded-full" />
                    <span 
                      class="text-[10px] uppercase tracking-wider"
                      :class="getCarStatusColor(car.status)"
                    >
                      {{ car.status }}
                    </span>
                  </div>
                  <h4 class="text-sm font-medium text-white truncate">{{ car.brand }} {{ car.model }}</h4>
                  <p class="text-xs text-gray-500">${{ formatPrice(car.price) }}</p>
                </div>

                <v-icon icon="mdi-chevron-right" size="16" class="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </router-link>
            </div>

            <div class="p-4 border-t border-white/10">
              <router-link 
                to="/admin/cars" 
                class="w-full py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <v-icon icon="mdi-plus" size="14" />
                Add New Vehicle
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Order Details Dialog -->
    <v-dialog v-model="orderDialog" max-width="700" class="sharp-dialog">
      <div v-if="selectedOrder" class="bg-[#0a0a0a] border border-white/20 text-white">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <span class="text-[10px] tracking-widest text-gray-500 uppercase block mb-1">Order Details</span>
            <h2 class="text-2xl font-light">#{{ selectedOrder.id.slice(-8).toUpperCase() }}</h2>
          </div>
          <button 
            @click="orderDialog = false" 
            class="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all"
          >
            <v-icon icon="mdi-close" size="20" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Customer & Order Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-white/10 p-4 bg-white/[0.02]">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-4">Customer Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Name</span>
                  <span class="text-white">{{ selectedOrder.customerInfo?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Email</span>
                  <span class="text-white text-xs">{{ selectedOrder.customerInfo?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Phone</span>
                  <span class="text-white">{{ selectedOrder.customerInfo?.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="border border-white/10 p-4 bg-white/[0.02]">
              <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-4">Order Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm items-center">
                  <span class="text-gray-500">Status</span>
                  <span 
                    class="px-2 py-0.5 text-[10px] tracking-widest uppercase border"
                    :class="getStatusClasses(selectedOrder.status)"
                  >
                    {{ selectedOrder.status }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Type</span>
                  <span class="text-white uppercase tracking-wider text-xs">{{ selectedOrder.type }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Date</span>
                  <span class="text-white text-xs">{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div>
            <h4 class="text-[10px] tracking-widest text-gray-500 uppercase mb-4">Order Items ({{ selectedOrder.items.length }})</h4>
            <div class="space-y-3">
              <div 
                v-for="item in selectedOrder.items" 
                :key="item.car.id"
                class="flex gap-4 p-4 border border-white/5 bg-white/[0.02]"
              >
                <div class="w-24 h-16 overflow-hidden bg-gray-900 shrink-0 relative">
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
                  <h4 class="text-base font-light text-white mb-1">{{ item.car.model }}</h4>
                  <p class="text-xs text-gray-500">{{ item.car.color }} • ${{ formatPrice(item.car.price) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center pt-4 border-t border-white/10">
            <span class="text-xs tracking-widest text-gray-500 uppercase">Total Amount</span>
            <span class="text-3xl font-light text-white">${{ formatPrice(selectedOrder.totalAmount) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button 
            @click="orderDialog = false"
            class="px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Close
          </button>
          <button 
            v-if="selectedOrder.status === 'pending'"
            @click="updateOrderStatus('confirmed')"
            class="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-wider hover:bg-emerald-500/30 transition-all flex items-center gap-2"
          >
            <v-icon icon="mdi-check" size="14" />
            Confirm Order
          </button>
          <button 
            v-if="selectedOrder.status === 'confirmed'"
            @click="updateOrderStatus('processing')"
            class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <v-icon icon="mdi-refresh" size="14" />
            Process Order
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarsStore } from '@/stores/cars'
import { useOrdersStore } from '@/stores/orders'

const carsStore = useCarsStore()
const ordersStore = useOrdersStore()

const orderDialog = ref(false)
const selectedOrder = ref(null)

const adminStats = computed(() => [
  {
    title: 'Total Cars',
    value: carsStore.cars.length,
    icon: 'mdi-car',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    change: 12,
  },
  {
    title: 'Available',
    value: carsStore.cars.filter(c => c.status === 'available').length,
    icon: 'mdi-check-circle',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    change: 5,
  },
  {
    title: 'Total Orders',
    value: ordersStore.orders.length,
    icon: 'mdi-clipboard-list',
    iconColor: 'text-white',
    borderColor: 'border-white/30',
    change: 8,
  },
  {
    title: 'Pending',
    value: ordersStore.orders.filter(o => o.status === 'pending').length,
    icon: 'mdi-clock-outline',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    change: -2,
  },
])

const quickActions = [
  {
    title: 'Add Car',
    description: 'New vehicle to inventory',
    icon: 'mdi-plus-circle',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    to: '/admin/cars',
  },
  {
    title: 'Manage Cars',
    description: 'Edit or remove vehicles',
    icon: 'mdi-car-cog',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    to: '/admin/cars',
  },
  {
    title: 'View Orders',
    description: 'Manage customer orders',
    icon: 'mdi-clipboard-list',
    iconColor: 'text-white',
    borderColor: 'border-white/30',
    to: '/admin/orders',
  },
  {
    title: 'Analytics',
    description: 'View sales statistics',
    icon: 'mdi-chart-line',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    to: '/admin',
  },
]

const recentOrders = computed(() => ordersStore.orders.slice(0, 5))
const recentCars = computed(() => carsStore.cars.slice(0, 5))

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

const getCarStatusColor = (status) => {
  const colors = {
    available: 'text-emerald-400',
    reserved: 'text-amber-400',
    sold: 'text-red-400',
  }
  return colors[status] || 'text-gray-400'
}

const formatPrice = (price) => price?.toLocaleString('en-US') || '0'

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const viewOrder = (order) => {
  selectedOrder.value = order
  orderDialog.value = true
}

const updateOrderStatus = async (status) => {
  if (selectedOrder.value) {
    await ordersStore.updateOrderStatus(selectedOrder.value.id, status)
    orderDialog.value = false
  }
}

onMounted(() => {
  carsStore.fetchCars()
  ordersStore.fetchAllOrders()
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
</style>  