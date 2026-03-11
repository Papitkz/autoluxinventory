<!-- components/Navbar.vue -->
<template>
  <v-app-bar 
    :elevation="0" 
    color="black" 
    class="border-b border-white/10"
    height="64"
  >
    <v-container class="max-w-[1600px] !px-4 lg:!px-8">
      <div class="flex items-center justify-between w-full">
        
        <!-- Mobile Menu Button -->
        <v-app-bar-nav-icon 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:!hidden text-white"
          variant="text"
        >
          <v-icon icon="mdi-menu" size="24" />
        </v-app-bar-nav-icon>

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
             <v-img width="50" :src="Al"></v-img>
          <div class="hidden sm:block">
            <h1 class="text-xl lg:text-2xl font-light text-white tracking-tighter uppercase">AutoLux</h1>
            <p class="text-[8px] lg:text-[10px] text-gray-500 tracking-[0.3em] uppercase hidden lg:block">Premium Inventory</p>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.to"
            :to="item.to"
            class="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors relative group py-2"
            :class="{ 'text-white': $route.path === item.to }"
          >
            {{ item.label }}
            <span class="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
          </router-link>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Cart -->
          <router-link 
            to="/cart" 
            class="w-10 h-10 lg:w-10 lg:h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all relative"
          >
            <v-icon icon="mdi-cart" size="18" />
            <span 
              v-if="cartStore.itemCount > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] flex items-center justify-center font-medium"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Auth Buttons (Desktop) -->
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/login" 
              class="hidden lg:flex px-6 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
            >
              Sign In
            </router-link>
          </template>

          <!-- User Menu (Desktop) -->
          <template v-else>
            <v-menu v-model="userMenuOpen" :close-on-content-click="false" location="bottom end">
              <template v-slot:activator="{ props }">
                <button 
                  v-bind="props"
                  class="hidden lg:flex items-center gap-3 pl-4 pr-2 py-2 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div class="text-right">
                    <p class="text-xs text-white font-medium">{{ authStore.currentUser?.displayName || 'User' }}</p>
                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">{{ authStore.isAdmin ? 'Admin' : 'Customer' }}</p>
                  </div>
                  <div class="w-8 h-8 bg-gray-800 overflow-hidden">
                    <img 
                      :src="authStore.currentUser?.photoURL || 'https://cdn.vuetifyjs.com/images/john.jpg'" 
                      class="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <v-icon icon="mdi-chevron-down" size="16" class="text-gray-500" />
                </button>
              </template>

              <v-card class="!bg-[#0a0a0a] !border-white/10 !rounded-none mt-2" min-width="200">
                <v-list class="!bg-transparent !p-0">
                  <v-list-item 
                    v-for="item in userMenuItems" 
                    :key="item.to"
                    :to="item.to"
                    class="!text-gray-400 hover:!text-white hover:!bg-white/5 !min-h-[48px] !px-4"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="item.icon" size="18" class="mr-3" />
                    </template>
                    <v-list-item-title class="!text-xs uppercase tracking-wider">{{ item.label }}</v-list-item-title>
                  </v-list-item>
                  
                  <v-divider class="!border-white/10" />
                  
                  <v-list-item 
                    @click="handleLogout"
                    class="!text-red-400 hover:!text-red-300 hover:!bg-red-500/5 !min-h-[48px] !px-4 cursor-pointer"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-logout" size="18" class="mr-3" />
                    </template>
                    <v-list-item-title class="!text-xs uppercase tracking-wider">Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
        </div>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="mobileMenuOpen"
    location="left"
    temporary
    class="!bg-black !border-r !border-white/10"
    width="300"
  >
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 border border-white/20 flex items-center justify-center">
          <v-icon icon="mdi-car-sports" size="24" class="text-white" />
        </div>
        <div>
          <h1 class="text-xl font-light text-white tracking-tighter uppercase">AutoLux</h1>
          <p class="text-[10px] text-gray-500 tracking-[0.3em] uppercase">Premium Inventory</p>
        </div>
      </div>
    </div>

    <v-list class="!bg-transparent !p-0">
      <!-- Main Nav Items -->
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="mobileMenuOpen = false"
        class="!border-b !border-white/5 !text-gray-400 hover:!text-white hover:!bg-white/5 !min-h-[56px] !px-6"
        :class="{ '!text-white !bg-white/10': $route.path === item.to }"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" size="20" class="mr-4" />
        </template>
        <v-list-item-title class="!text-sm uppercase tracking-wider">{{ item.label }}</v-list-item-title>
      </v-list-item>

      <v-divider class="!border-white/10 my-4" />

      <!-- Auth Section -->
      <template v-if="!authStore.isAuthenticated">
        <v-list-item
          to="/login"
          @click="mobileMenuOpen = false"
          class="!text-white !bg-white/5 hover:!bg-white/10 !min-h-[56px] !px-6 !mx-4 !border !border-white/20"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-login" size="20" class="mr-4" />
          </template>
          <v-list-item-title class="!text-sm uppercase tracking-wider font-medium">Sign In</v-list-item-title>
        </v-list-item>
        
        <v-list-item
          to="/register"
          @click="mobileMenuOpen = false"
          class="!text-gray-400 hover:!text-white !min-h-[56px] !px-6"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-account-plus" size="20" class="mr-4" />
          </template>
          <v-list-item-title class="!text-sm uppercase tracking-wider">Create Account</v-list-item-title>
        </v-list-item>
      </template>

      <template v-else>
        <!-- User Info -->
        <div class="px-6 py-4 border-b border-white/10">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 bg-gray-800 overflow-hidden">
              <img 
                :src="authStore.currentUser?.photoURL || 'https://cdn.vuetifyjs.com/images/john.jpg'" 
                class="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <div>
              <p class="text-sm text-white font-medium">{{ authStore.currentUser?.displayName || 'User' }}</p>
              <p class="text-[10px] text-gray-500 uppercase tracking-wider">{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
          <div 
            class="inline-block px-2 py-1 border text-[10px] tracking-wider uppercase"
            :class="authStore.isAdmin ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-white/20 text-gray-400'"
          >
            {{ authStore.isAdmin ? 'Administrator' : 'Customer' }}
          </div>
        </div>

        <!-- User Menu Items -->
        <v-list-item
          v-for="item in userMenuItems"
          :key="item.to"
          :to="item.to"
          @click="mobileMenuOpen = false"
          class="!border-b !border-white/5 !text-gray-400 hover:!text-white hover:!bg-white/5 !min-h-[56px] !px-6"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="20" class="mr-4" />
          </template>
          <v-list-item-title class="!text-sm uppercase tracking-wider">{{ item.label }}</v-list-item-title>
        </v-list-item>

        <v-divider class="!border-white/10 my-4" />

        <v-list-item
          @click="handleLogout"
          class="!text-red-400 hover:!text-red-300 hover:!bg-red-500/5 !min-h-[56px] !px-6 cursor-pointer"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-logout" size="20" class="mr-4" />
          </template>
          <v-list-item-title class="!text-sm uppercase tracking-wider">Sign Out</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import Al from '../../public/AL.webp'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const navItems = [
  { to: '/', label: 'Home', icon: 'mdi-home' },
  { to: '/cars', label: 'Inventory', icon: 'mdi-car' },
  { to: '/services', label: 'Services', icon: 'mdi-wrench' },
  { to: '/about', label: 'About', icon: 'mdi-information' },
  { to: '/contact', label: 'Contact', icon: 'mdi-phone' },
]

const userMenuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard' },
  { to: '/profile', label: 'Profile', icon: 'mdi-account' },
  { to: '/cart', label: 'My Cart', icon: 'mdi-cart' },
  ...(authStore.isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: 'mdi-shield-account' }] : []),
]

const handleLogout = async () => {
  mobileMenuOpen.value = false
  userMenuOpen.value = false
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
:deep(.v-app-bar) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-navigation-drawer) {
  background-color: #000 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Hide default Vuetify scrollbar styling */
:deep(.v-navigation-drawer__content) {
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb) {
  background-color: #333;
}
</style>