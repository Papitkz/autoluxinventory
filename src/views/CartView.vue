<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Shopping Cart</span>
            <h1 class="text-4xl lg:text-5xl font-light tracking-tight">
              YOUR <span class="text-gray-500">SELECTION</span>
            </h1>
          </div>
          <div v-if="!cartStore.isEmpty" class="text-sm text-gray-400 font-light">
            {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'Vehicle' : 'Vehicles' }} selected
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <!-- Empty Cart -->
      <div v-if="cartStore.isEmpty" class="border border-white/10 p-20 text-center">
        <v-icon icon="mdi-cart-off" size="64" class="text-gray-700 mb-6" />
        <h2 class="text-2xl font-light mb-3">Your cart is empty</h2>
        <p class="text-gray-500 text-sm mb-8 font-light max-w-md mx-auto">
          Browse our curated inventory and add vehicles to your selection. Each car represents automotive excellence.
        </p>
        <router-link 
          to="/cars" 
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium"
        >
          <v-icon icon="mdi-arrow-left" size="16" />
          Browse Inventory
        </router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="flex flex-col lg:flex-row gap-12">
        
        <!-- Items List -->
        <div class="flex-1">
          <!-- Cart Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <span class="text-xs tracking-widest text-gray-500 uppercase">Cart Items ({{ cartStore.itemCount }})</span>
            <button 
              @click="clearCart"
              class="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              <v-icon icon="mdi-delete" size="14" />
              Clear All
            </button>
          </div>

          <!-- Items -->
          <div class="space-y-6">
            <div 
              v-for="(item, index) in cartStore.cartItems" 
              :key="item.car.id"
              class="group border border-white/10 hover:border-white/20 transition-all duration-300 bg-white/[0.02]"
            >
              <div class="flex flex-col md:flex-row">
                <!-- Image -->
                <div class="w-full md:w-48 aspect-[4/3] md:aspect-auto md:h-40 overflow-hidden bg-gray-900 shrink-0">
                  <v-img 
                    :src="item.car.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'" 
                    cover 
                    class="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <!-- Details -->
                <div class="flex-1 p-6 flex flex-col justify-between">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <span class="text-[10px] tracking-widest text-gray-500 uppercase">{{ item.car.year }}</span>
                        <span class="w-1 h-1 bg-gray-700" />
                        <span class="text-[10px] tracking-widest text-gray-500 uppercase">{{ item.car.category }}</span>
                      </div>
                      <h3 class="text-lg font-medium text-white mb-1">{{ item.car.brand }} {{ item.car.model }}</h3>
                      <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                          <v-icon icon="mdi-gas-station" size="12" />
                          {{ item.car.fuelType }}
                        </span>
                        <span class="flex items-center gap-1">
                          <v-icon icon="mdi-car-shift-pattern" size="12" />
                          {{ item.car.transmission }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <div class="text-xl font-light text-white">${{ formatPrice(item.car.price) }}</div>
                    </div>
                  </div>

                  <!-- Bottom Row: Notes & Actions -->
                  <div class="flex items-end justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                    <div class="flex-1 max-w-md">
                      <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Notes (Optional)</label>
                      <input 
                        v-model="item.notes"
                        type="text"
                        placeholder="Add special requests..."
                        class="w-full bg-transparent border border-white/10 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                        @blur="updateNotes(item.car.id, item.notes)"
                      />
                    </div>
                    
                    <button 
                      @click="removeItem(item.car.id)"
                      class="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                      <v-icon icon="mdi-delete" size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Continue Shopping -->
          <div class="mt-8">
            <router-link 
              to="/cars" 
              class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <v-icon icon="mdi-arrow-left" size="16" class="group-hover:-translate-x-1 transition-transform" />
              <span class="tracking-wide">Continue Shopping</span>
            </router-link>
          </div>
        </div>

        <!-- Order Summary - Sticky -->
        <aside class="w-full lg:w-96 shrink-0">
          <div class="sticky top-24 border border-white/10 bg-white/[0.02] p-6">
            <h3 class="text-xs tracking-widest text-gray-500 uppercase mb-6">Order Summary</h3>

            <!-- Line Items -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400 font-light">Subtotal</span>
                <span class="text-white">${{ formatPrice(cartStore.totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400 font-light">Tax (8%)</span>
                <span class="text-white">${{ formatPrice(tax) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400 font-light">Processing</span>
                <span class="text-white">$199</span>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-[1px] bg-white/10 mb-6" />

            <!-- Total -->
            <div class="flex justify-between items-end mb-8">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Total</span>
              <span class="text-3xl font-light text-white">${{ formatPrice(total) }}</span>
            </div>

            <!-- CTA -->
            <button 
              @click="showCheckoutDialog = true"
              class="w-full py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium mb-4 flex items-center justify-center gap-2"
            >
              <v-icon icon="mdi-calendar-check" size="18" />
              Proceed to Reserve
            </button>

            <div class="flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-wider">
              <v-icon icon="mdi-shield-check" size="12" />
              <span>Secure Reservation Process</span>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Checkout Dialog -->
    <v-dialog v-model="showCheckoutDialog" max-width="600" class="sharp-dialog">
      <div class="bg-[#0a0a0a] border border-white/20 text-white">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10">
          <h2 class="text-xl font-light">Complete Reservation</h2>
          <button @click="showCheckoutDialog = false" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>

        <!-- Form -->
        <div class="p-6 space-y-6">
          <div>
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4">Contact Information</h4>
            <div class="space-y-4">
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Full Name</label>
                <input 
                  v-model="customerInfo.name"
                  type="text"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Email</label>
                <input 
                  v-model="customerInfo.email"
                  type="email"
                  :class="{ 'border-red-400': emailError }"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
                <span v-if="emailError" class="text-[10px] text-red-400 mt-1 block">{{ emailError }}</span>
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Phone</label>
                <input 
                  v-model="customerInfo.phone"
                  type="tel"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Address</label>
                <textarea 
                  v-model="customerInfo.address"
                  rows="2"
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="123 Luxury Lane, Beverly Hills, CA 90210"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-xs tracking-widest text-gray-500 uppercase mb-4">Reservation Type</h4>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="reservationType = 'reservation'"
                class="p-4 border text-left transition-all"
                :class="reservationType === 'reservation' ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/30'"
              >
                <div class="text-sm font-medium mb-1">Reserve</div>
                <div class="text-[10px] opacity-70">Hold for 7 days</div>
              </button>
              <button
                @click="reservationType = 'purchase'"
                class="p-4 border text-left transition-all"
                :class="reservationType === 'purchase' ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/30'"
              >
                <div class="text-sm font-medium mb-1">Purchase</div>
                <div class="text-[10px] opacity-70">Buy now</div>
              </button>
            </div>
          </div>

          <!-- Deposit Notice -->
          <div v-if="reservationType === 'reservation'" class="border border-amber-500/30 bg-amber-500/10 p-4">
            <div class="flex items-start gap-3">
              <v-icon icon="mdi-information" size="16" class="text-amber-500 mt-0.5" />
              <div class="text-xs text-gray-400 leading-relaxed">
                A <span class="text-white font-medium">$500 deposit per vehicle</span> is required for reservation. 
                This amount will be applied to your final purchase price.
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button 
            @click="showCheckoutDialog = false"
            class="px-6 py-3 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button 
            @click="submitReservation"
            :disabled="ordersStore.loading || !isFormValid"
            class="px-8 py-3 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="ordersStore.loading">Processing...</span>
            <span v-else>Confirm</span>
            <v-icon v-if="!ordersStore.loading" icon="mdi-arrow-right" size="16" />
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="500" class="sharp-dialog">
      <div class="bg-[#0a0a0a] border border-white/20 text-white p-12 text-center">
        <div class="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-6">
          <v-icon icon="mdi-check" color="black" size="32" />
        </div>
        <h2 class="text-2xl font-light mb-3">Reservation Confirmed</h2>
        <p class="text-gray-500 text-sm mb-8 font-light max-w-sm mx-auto">
          Your reservation has been successfully placed. You will receive a confirmation email shortly with next steps.
        </p>
        <router-link 
          to="/dashboard" 
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors font-medium"
        >
          View Reservations
          <v-icon icon="mdi-arrow-right" size="16" />
        </router-link>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

// Dialog states
const showCheckoutDialog = ref(false)
const showSuccessDialog = ref(false)
const reservationType = ref('reservation')
const isSubmitting = ref(false)
const emailError = ref('')

// Customer info form
const customerInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// Initialize from auth
const initFromAuth = () => {
  if (authStore.currentUser) {
    customerInfo.value.name = authStore.currentUser.displayName || ''
    customerInfo.value.email = authStore.currentUser.email || ''
  }
}

// Watch auth changes
watch(() => authStore.currentUser, (newUser) => {
  if (newUser && !customerInfo.value.name) {
    initFromAuth()
  }
}, { immediate: true })

// Computed
const tax = computed(() => cartStore.totalAmount * 0.08)
const total = computed(() => cartStore.totalAmount + tax.value + 199)

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-US')
}

const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !!customerInfo.value.name?.trim() && 
         !!customerInfo.value.email?.trim() && 
         emailRegex.test(customerInfo.value.email) &&
         !!customerInfo.value.phone?.trim() && 
         !!customerInfo.value.address?.trim()
})

// Cart actions
const removeItem = (carId) => {
  cartStore.removeFromCart(carId)
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

const updateNotes = (carId, notes) => {
  cartStore.updateNotes(carId, notes || '')
}

// Main submit function - FIXED
const submitReservation = async () => {
  console.log('🚀 Submit started...')
  
  // Prevent double submit
  if (isSubmitting.value) {
    console.log('Already submitting, blocked')
    return
  }
  
  // Validate form
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(customerInfo.value.email)) {
    emailError.value = 'Please enter a valid email address'
    return
  }
  emailError.value = ''

  // Check auth
  if (!authStore.currentUser?.uid) {
    console.log('No user, redirecting to login')
    router.push('/login?redirect=/cart')
    return
  }

  // Check cart
  if (cartStore.isEmpty) {
    alert('Your cart is empty. Please add vehicles first.')
    return
  }

  isSubmitting.value = true

  try {
    console.log('Creating order with:')
    console.log('- User ID:', authStore.currentUser.uid)
    console.log('- Items:', cartStore.cartItems.length)
    console.log('- Type:', reservationType.value)
    console.log('- Customer:', customerInfo.value.name, customerInfo.value.email)

    // Call store action
    const order = await ordersStore.createOrder(
      authStore.currentUser.uid,
      cartStore.cartItems,
      {
        name: customerInfo.value.name.trim(),
        email: customerInfo.value.email.trim(),
        phone: customerInfo.value.phone.trim(),
        address: customerInfo.value.address.trim()
      },
      reservationType.value,
      authStore.currentUser.email,
      authStore.currentUser.displayName
    )

    console.log('Order result:', order)

    if (order?.id) {
      console.log('✅ Success! Order ID:', order.id)
      
      // Clear cart and show success
      cartStore.clearCart()
      showCheckoutDialog.value = false
      showSuccessDialog.value = true
      
      // Reset form
      customerInfo.value = { name: '', email: '', phone: '', address: '' }
    } else {
      throw new Error('Order creation returned invalid data')
    }

  } catch (err) {
    console.error('❌ Submit failed:', err)
    alert('Failed to place order: ' + (err.message || 'Unknown error'))
  } finally {
    isSubmitting.value = false
  }
}

// Initialize
onMounted(() => {
  initFromAuth()
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

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Input focus states */
input:focus, textarea:focus {
  outline: none;
}
</style>