<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Account Settings</span>
            <h1 class="text-4xl lg:text-5xl font-light tracking-tight">
              MY <span class="text-gray-500">PROFILE</span>
            </h1>
          </div>
          <router-link 
            to="/dashboard" 
            class="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            <v-icon icon="mdi-view-dashboard" size="14" />
            Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Column: Profile Card -->
        <aside class="w-full lg:w-80 shrink-0 space-y-6">
          
          <!-- Profile Image Card -->
          <div class="border border-white/10 bg-white/[0.02] overflow-hidden">
            <div class="h-24 bg-gradient-to-b from-white/[0.05] to-transparent relative">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
            <div class="px-6 pb-6 -mt-12 relative text-center">
              <div class="relative w-24 h-24 mx-auto mb-4">
                <div class="w-24 h-24 overflow-hidden bg-gray-900 border-2 border-black relative">
                  <img 
                    :src="previewImage || authStore.currentUser?.photoURL || 'https://cdn.vuetifyjs.com/images/john.jpg'"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 ring-1 ring-white/20" />
                </div>
                <!-- Upload Overlay -->
                <label 
                  class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <v-icon icon="mdi-camera" size="24" class="text-white" />
                  <input 
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </label>
              </div>
              
              <h3 class="text-lg font-medium text-white mb-1">
                {{ profileForm.displayName || 'User' }}
              </h3>
              <p class="text-xs text-gray-500 mb-4">
                {{ authStore.currentUser?.email }}
              </p>
              
              <div 
                class="inline-block px-3 py-1.5 border text-[10px] tracking-[0.2em] uppercase mb-4"
                :class="authStore.isAdmin ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-white/20 text-gray-400 bg-white/[0.02]'"
              >
                <v-icon v-if="authStore.isAdmin" icon="mdi-shield" size="12" class="mr-1" />
                {{ authStore.isAdmin ? 'Administrator' : 'Customer' }}
              </div>

              <p class="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Member Since</p>
              <p class="text-xs text-gray-400">{{ memberSince }}</p>
            </div>
          </div>

          <!-- Account Stats -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Account Stats</span>
            </div>
            <div class="divide-y divide-white/5">
              <div class="px-6 py-4 flex items-center justify-between">
                <span class="text-sm text-gray-400">Total Orders</span>
                <span class="text-lg font-light text-white">{{ orderCount }}</span>
              </div>
              <div class="px-6 py-4 flex items-center justify-between">
                <span class="text-sm text-gray-400">Cart Items</span>
                <span class="text-lg font-light text-white">{{ cartStore.itemCount }}</span>
              </div>
              <div class="px-6 py-4 flex items-center justify-between">
                <span class="text-sm text-gray-400">Account Status</span>
                <span class="text-xs text-emerald-400 uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="border border-red-500/20 bg-red-500/5">
            <div class="px-6 py-4 border-b border-red-500/20">
              <span class="text-xs tracking-widest text-red-400 uppercase flex items-center gap-2">
                <v-icon icon="mdi-alert" size="14" />
                Danger Zone
              </span>
            </div>
            <div class="p-6 space-y-3">
              <button 
                @click="showDeleteDialog = true"
                class="w-full py-3 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <v-icon icon="mdi-delete-forever" size="14" />
                Delete Account
              </button>
            </div>
          </div>
        </aside>

        <!-- Right Column: Forms -->
        <div class="flex-1 space-y-6">
          
          <!-- Personal Information -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <span class="text-xs tracking-widest text-gray-500 uppercase flex items-center gap-2">
                <v-icon icon="mdi-account" size="14" />
                Personal Information
              </span>
              <span v-if="profileSuccess" class="text-xs text-emerald-400 flex items-center gap-1">
                <v-icon icon="mdi-check" size="12" />
                Saved
              </span>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Display Name *</label>
                  <input 
                    v-model="profileForm.displayName"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Email Address *</label>
                  <input 
                    v-model="profileForm.email"
                    type="email"
                    disabled
                    class="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p class="text-[10px] text-gray-600 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Phone Number</label>
                  <input 
                    v-model="profileForm.phone"
                    type="tel"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Address</label>
                  <input 
                    v-model="profileForm.address"
                    type="text"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="Your address"
                  />
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button 
                  @click="saveProfile"
                  :disabled="authStore.loading || !profileForm.displayName"
                  class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  <v-icon v-if="!authStore.loading" icon="mdi-content-save" size="14" />
                  <span v-if="authStore.loading">Updating...</span>
                  <span v-else>Update Profile</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Change Password -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <span class="text-xs tracking-widest text-gray-500 uppercase flex items-center gap-2">
                <v-icon icon="mdi-lock" size="14" />
                Security
              </span>
              <span v-if="passwordSuccess" class="text-xs text-emerald-400 flex items-center gap-1">
                <v-icon icon="mdi-check" size="12" />
                Password Updated
              </span>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Current Password</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      <v-icon :icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'" size="16" />
                    </button>
                  </div>
                </div>
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">New Password</label>
                    <div class="relative">
                      <input 
                        v-model="passwordForm.newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors pr-10"
                        placeholder="Min 6 characters"
                      />
                      <button 
                        @click="showNewPassword = !showNewPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        <v-icon :icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'" size="16" />
                      </button>
                    </div>
                    <div class="mt-2 flex gap-1">
                      <div 
                        v-for="i in 4" 
                        :key="i"
                        class="h-1 flex-1 transition-colors"
                        :class="passwordStrength >= i ? 'bg-emerald-400' : 'bg-white/10'"
                      />
                    </div>
                    <p class="text-[10px] text-gray-600 mt-1">{{ passwordStrengthText }}</p>
                  </div>
                  <div>
                    <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Confirm New Password</label>
                    <div class="relative">
                      <input 
                        v-model="passwordForm.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors pr-10"
                        placeholder="Repeat password"
                      />
                      <button 
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        <v-icon :icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'" size="16" />
                      </button>
                    </div>
                    <p v-if="passwordMismatch" class="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <v-icon icon="mdi-alert-circle" size="12" />
                      Passwords don't match
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button 
                  @click="changePassword"
                  :disabled="authStore.loading || !canChangePassword"
                  class="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  <v-icon v-if="!authStore.loading" icon="mdi-lock-reset" size="14" />
                  <span v-if="authStore.loading">Updating...</span>
                  <span v-else>Change Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Account Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500" class="sharp-dialog">
      <div class="bg-[#0a0a0a] border border-red-500/30 text-white p-8">
        <div class="w-16 h-16 border border-red-500/30 bg-red-500/10 flex items-center justify-center mb-6">
          <v-icon icon="mdi-alert" size="32" class="text-red-400" />
        </div>
        <h2 class="text-2xl font-light mb-3">Delete Account?</h2>
        <p class="text-gray-500 text-sm mb-6 font-light">
          This action is permanent and cannot be undone. All your data, orders, and saved information will be permanently removed.
        </p>
        <div class="space-y-4 mb-6">
          <div>
            <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Type DELETE to confirm</label>
            <input 
              v-model="deleteConfirmText"
              type="text"
              class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-red-500/50 focus:outline-none transition-colors"
              placeholder="DELETE"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <button 
            @click="showDeleteDialog = false"
            class="flex-1 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </button>
          <button 
            @click="deleteAccount"
            :disabled="deleteConfirmText !== 'DELETE' || authStore.loading"
            class="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider hover:bg-red-500/30 transition-all disabled:opacity-30"
          >
            <span v-if="authStore.loading">Deleting...</span>
            <span v-else class="flex items-center justify-center gap-2">
              <v-icon icon="mdi-delete-forever" size="14" />
              Delete Forever
            </span>
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-50 px-6 py-4 border flex items-center gap-3 transition-all duration-300"
      :class="toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'"
    >
      <v-icon :icon="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" size="20" />
      <span class="text-sm">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

// State
const profileSuccess = ref(false)
const passwordSuccess = ref(false)
const showDeleteDialog = ref(false)
const deleteConfirmText = ref('')
const previewImage = ref(null)

// Password visibility
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Forms
const profileForm = ref({
  displayName: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Toast
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Computed
const orderCount = computed(() => ordersStore.userOrders.length)

const memberSince = computed(() => {
  const user = authStore.currentUser
  if (!user?.createdAt) return 'Unknown'
  return new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const passwordStrength = computed(() => {
  const pwd = passwordForm.value.newPassword
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 6) strength++
  if (pwd.length >= 10) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) strength++
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value] || 'Enter password'
})

const passwordMismatch = computed(() => {
  return passwordForm.value.confirmPassword && 
         passwordForm.value.newPassword !== passwordForm.value.confirmPassword
})

const canChangePassword = computed(() => {
  return passwordForm.value.currentPassword && 
         passwordForm.value.newPassword.length >= 6 &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// Methods
const showToast = (message, type = 'success') => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  // Upload via store
  const photoURL = await authStore.uploadProfileImage(file)
  if (photoURL) {
    const success = await authStore.updateUserProfile({ photoURL })
    if (success) {
      showToast('Profile image updated')
      previewImage.value = null // Reset preview to use the actual URL
    } else {
      showToast(authStore.error || 'Failed to update image', 'error')
    }
  } else {
    showToast(authStore.error || 'Failed to upload image', 'error')
  }
}

const saveProfile = async () => {
  const success = await authStore.updateUserProfile({
    displayName: profileForm.value.displayName,
    phone: profileForm.value.phone,
    address: profileForm.value.address
  })
  
  if (success) {
    profileSuccess.value = true
    setTimeout(() => profileSuccess.value = false, 3000)
    showToast('Profile updated successfully')
  } else {
    showToast(authStore.error || 'Failed to update profile', 'error')
  }
}

const changePassword = async () => {
  const success = await authStore.updateUserPassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword
  )
  
  if (success) {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    passwordSuccess.value = true
    setTimeout(() => passwordSuccess.value = false, 3000)
    showToast('Password updated successfully')
  } else {
    showToast(authStore.error || 'Failed to update password', 'error')
  }
}

const deleteAccount = async () => {
  const success = await authStore.deleteAccount()
  if (success) {
    showToast('Account deleted successfully')
    router.push('/')
  } else {
    showToast(authStore.error || 'Failed to delete account', 'error')
  }
}

// Initialize
onMounted(() => {
  const user = authStore.currentUser
  if (user) {
    profileForm.value = {
      displayName: user.displayName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    }
  }
  
  // Fetch orders for stats
  if (user) {
    ordersStore.fetchUserOrders(user.uid)
  }
})
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Vuetify overrides */
:deep(.v-icon) {
  border-radius: 0 !important;
}

:deep(.v-img) {
  border-radius: 0 !important;
}

:deep(.v-avatar) {
  border-radius: 0 !important;
}

:deep(.v-chip) {
  border-radius: 0 !important;
}

:deep(.v-list-item) {
  border-radius: 0 !important;
}

:deep(.v-dialog) {
  border-radius: 0 !important;
}

:deep(.v-overlay__content) {
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
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

/* Input autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>