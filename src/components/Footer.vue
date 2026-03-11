<template>
  <footer class="bg-black border-t border-white/10 pt-20 pb-0 font-['Poppins']">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
      
      <!-- Main Grid -->
      <div class="grid grid-cols-12 gap-8 mb-16">
        
        <!-- Brand Column - Spans 5 -->
        <div class="col-span-12 lg:col-span-5">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 bg-white flex items-center justify-center shrink-0">
                <v-img :src="Al"></v-img>
            </div>
            <div>
              <h3 class="text-2xl font-medium tracking-tight text-white mb-1">AUTOLUX</h3>
              <div class="w-16 h-[2px] bg-white/30" />
            </div>
          </div>
          
          <p class="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm font-light">
            Curating the world's finest automobiles for the most discerning collectors. Precision, passion, perfection since 2009.
          </p>

          <!-- Social Grid -->
          <div class="flex gap-2">
            <a 
              v-for="social in socials" 
              :key="social.name"
              :href="social.link"
              target="_blank"
              class="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white hover:bg-white transition-all duration-300 group"
            >
              <v-icon :icon="social.icon" size="18" class="group-hover:text-black transition-colors" />
            </a>
          </div>
        </div>

        <!-- Quick Links - Spans 2 -->
        <div class="col-span-6 lg:col-span-2">
          <h4 class="text-xs tracking-[0.2em] text-gray-500 uppercase mb-6 font-medium">Navigate</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link 
                :to="link.path" 
                class="text-sm text-gray-400 hover:text-white transition-colors duration-300 block font-light relative group"
              >
                <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Services - Spans 2 -->
        <div class="col-span-6 lg:col-span-2">
          <h4 class="text-xs tracking-[0.2em] text-gray-500 uppercase mb-6 font-medium">Services</h4>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service">
              <span class="text-sm text-gray-400 font-light">{{ service }}</span>
            </li>
          </ul>
        </div>

        <!-- Contact - Spans 3 -->
        <div class="col-span-12 lg:col-span-3">
          <h4 class="text-xs tracking-[0.2em] text-gray-500 uppercase mb-6 font-medium">Contact</h4>
          <div class="space-y-4">
            <div v-for="contact in contacts" :key="contact.label" class="group cursor-pointer">
              <div class="text-[10px] tracking-wider text-gray-600 uppercase mb-1">{{ contact.label }}</div>
              <div class="text-sm text-gray-300 group-hover:text-white transition-colors font-light flex items-start gap-2">
                <v-icon :icon="contact.icon" size="14" class="mt-1 text-gray-600 group-hover:text-white transition-colors" />
                {{ contact.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Large Typography Accent -->
      <div class="border-t border-white/5 py-12 overflow-hidden">
        <div class="flex items-center justify-between">
          <h2 class="text-[8vw] lg:text-[6vw] font-light text-white/5 tracking-tighter leading-none select-none">
            AUTOLUX
          </h2>
          <div class="hidden lg:flex items-center gap-8 text-xs tracking-widest text-gray-600 uppercase">
            <span>Precision</span>
            <span class="w-2 h-2 bg-white/20" />
            <span>Passion</span>
            <span class="w-2 h-2 bg-white/20" />
            <span>Perfection</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-gray-600 font-light">
          © {{ new Date().getFullYear() }} AutoLux. All rights reserved.
        </p>
        
        <div class="flex items-center gap-6 text-xs text-gray-600 font-light">
          <router-link to="/privacy" class="hover:text-white transition-colors">Privacy</router-link>
          <span class="text-gray-800">|</span>
          <router-link to="/terms" class="hover:text-white transition-colors">Terms</router-link>
          <span class="text-gray-800">|</span>
          <router-link to="/sitemap" class="hover:text-white transition-colors">Sitemap</router-link>
        </div>

        <!-- <button 
          @click="scrollToTop"
          class="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors group uppercase tracking-wider"
        >
          <span>Back to top</span>
          <div class="w-6 h-6 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
            <v-icon icon="mdi-arrow-up" size="14" class="group-hover:text-black transition-colors" />
          </div>
        </button> -->
      </div>
    </div>
  </footer>
</template>

<script setup>
import Al from '../../public/AL.webp'
const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Inventory', path: '/cars' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Financing', path: '/financing' }
]

const services = [
  'Car Sales',
  'Reservation',
  'Financing',
  'Trade-In',
  'Inspection',
  'Warranty'
]

const socials = [
  { name: 'Facebook', icon: 'mdi-facebook', link: '#' },
  { name: 'Twitter', icon: 'mdi-twitter', link: '#' },
  { name: 'Instagram', icon: 'mdi-instagram', link: '#' },
  { name: 'LinkedIn', icon: 'mdi-linkedin', link: '#' }
]

const contacts = [
  { icon: 'mdi-map-marker', label: 'Address', value: '123 Luxury Lane, Beverly Hills, CA 90210' },
  { icon: 'mdi-phone', label: 'Phone', value: '+63956-487-4933' },
  { icon: 'mdi-email', label: 'Email', value: 'info@autolux.com' },
  { icon: 'mdi-clock', label: 'Hours', value: 'Mon - Sat: 9AM - 7PM' }
]

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Force no radius */
* {
  border-radius: 0 !important;
}

/* Override Vuetify defaults */
:deep(.v-icon) {
  border-radius: 0 !important;
}

:deep(.v-btn) {
  border-radius: 0 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Selection */
::selection {
  background: white;
  color: black;
}
</style>