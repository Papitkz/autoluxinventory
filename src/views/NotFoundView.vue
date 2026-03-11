<template>
  <div class="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
    
    <!-- Decorative Elements -->
    <div class="absolute top-20 left-20 w-64 h-64 border border-white/5 rotate-45 hidden lg:block" />
    <div class="absolute bottom-20 right-20 w-96 h-96 border border-white/5 rotate-12 hidden lg:block" />
    <div class="absolute top-1/2 left-10 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block" />
    <div class="absolute top-1/3 right-16 w-px h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
      <div class="flex flex-col items-center text-center">
        
        <!-- Error Code -->
        <div class="relative mb-8">
          <span class="text-[12rem] md:text-[16rem] font-light text-white/5 leading-none select-none absolute -top-8 left-1/2 -translate-x-1/2">
            404
          </span>
          <div class="relative">
            <div class="w-24 h-24 md:w-32 md:h-32 border border-white/10 flex items-center justify-center mb-6 mx-auto bg-white/[0.02]">
              <v-icon icon="mdi-car-off" size="48" class="text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <span class="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">Error Code</span>
        <h1 class="text-6xl md:text-8xl font-light text-white mb-4 tracking-tight">
          404
        </h1>
        
        <div class="w-16 h-px bg-white/20 mb-8" />
        
        <h2 class="text-2xl md:text-3xl font-light text-white mb-4 tracking-wide">
          PAGE NOT FOUND
        </h2>
        
        <p class="text-gray-400 text-sm md:text-base max-w-md mb-12 font-light leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to our inventory.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link 
            to="/" 
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-all font-medium"
          >
            <v-icon icon="mdi-home" size="18" />
            Return Home
          </router-link>
          
          <router-link 
            to="/cars" 
            class="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/40 transition-all"
          >
            <v-icon icon="mdi-car-search" size="18" />
            Browse Inventory
          </router-link>
        </div>

        <!-- Quick Links -->
        <div class="mt-16 pt-8 border-t border-white/10 w-full max-w-lg">
          <p class="text-[10px] tracking-widest text-gray-500 uppercase mb-6">You may also like</p>
          <div class="flex flex-wrap justify-center gap-6">
            <router-link to="/dashboard" class="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              Dashboard
            </router-link>
            <router-link to="/cart" class="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              My Cart
            </router-link>
            <router-link to="/contact" class="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              Contact
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Decoration -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
</template>

<script setup>
// No script needed
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

/* Responsive text sizing */
@media (max-width: 768px) {
  .text-\[12rem\] {
    font-size: 8rem;
  }
}
</style>