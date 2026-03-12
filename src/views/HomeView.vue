<!-- homeview.vue - Responsive Version with Video Selector -->
<template>
  <div class="app-wrapper">
    <!-- Luxury Automotive Preloader -->
    <transition name="fade">
      <div class="preloader" v-if="loading">
        <div class="preloader-content">
          <div class="tachometer">
            <div class="tacho-outer-ring">
              <div class="tacho-marks">
                <span v-for="i in 12" :key="i" class="mark" :style="{ transform: `rotate(${i * 30}deg)` }"></span>
              </div>
              <div class="tacho-numbers">
                <span class="num num-0">0</span>
                <span class="num num-1">1</span>
                <span class="num num-2">2</span>
                <span class="num num-3">3</span>
                <span class="num num-4">4</span>
                <span class="num num-5">5</span>
                <span class="num num-6">6</span>
                <span class="num num-7">7</span>
                <span class="num num-8">8</span>
              </div>
              <div class="tacho-center">
                <v-icon icon="mdi-car-sports" size="32" class="tacho-icon" />
              </div>
              <div class="tacho-needle" :style="{ transform: `rotate(${needleRotation}deg)` }">
                <div class="needle-body"></div>
                <div class="needle-pivot"></div>
              </div>
              <div class="tacho-glass"></div>
            </div>
          </div>
          <div class="loading-status">
            <div class="status-text" :class="{ 'revving': rpm > 4 }">{{ loadingStatus }}</div>
            <div class="status-bar">
              <div class="status-fill" :style="{ width: loadProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Navigation Progress -->
    <div class="nav-progress" :style="{ transform: `scaleX(${scrollProgress})` }" />
    
    <!-- Hero Section - Mobile Optimized with Video Selector -->
    <section class="hero min-h-[100svh] lg:min-h-screen">
      <div class="hero-bg">
        <!-- Video Background -->
        <video 
          ref="heroVideo"
          autoplay 
          muted 
          loop 
          playsinline
          :poster="currentVideo.poster"
          class="hero-video"
          @loadeddata="onVideoLoaded"
        >
          <source :src="currentVideo.url" type="video/mp4">
          <!-- Fallback image if video fails -->
          <img 
            :src="currentVideo.poster" 
            alt="Luxury Car"
            class="hero-image"
          />
        </video>
        
        <!-- Dark Overlay for better text readability -->
        <div class="hero-overlay" />
        
        <!-- Optional: Gradient overlay for cinematic effect -->
        <div class="hero-gradient" />
      </div>

      <!-- Video Selector - Floating Control -->
      <div class="video-selector" :class="{ 'expanded': selectorExpanded }">
        <button class="selector-toggle" @click="selectorExpanded = !selectorExpanded">
          <v-icon :icon="selectorExpanded ? 'mdi-chevron-down' : 'mdi-movie-open'" size="20" />
          <span class="hidden sm:inline">{{ selectorExpanded ? 'Close' : 'Select Video' }}</span>
        </button>
        
        <div class="selector-panel" v-show="selectorExpanded">
          <div class="selector-header">
            <span class="text-xs uppercase tracking-wider text-gray-400">Choose Atmosphere</span>
          </div>
          <div class="video-options">
            <button 
              v-for="(video, index) in videoOptions" 
              :key="index"
              class="video-option"
              :class="{ 'active': currentVideoIndex === index }"
              @click="selectVideo(index)"
            >
              <div class="option-thumbnail">
                <img :src="video.thumbnail" :alt="video.label" />
                <div class="option-overlay">
                  <v-icon v-if="currentVideoIndex === index" icon="mdi-play-circle" size="24" class="text-[#c9a962]" />
                  <v-icon v-else icon="mdi-play-circle-outline" size="24" />
                </div>
              </div>
              <div class="option-info">
                <span class="option-number">0{{ index + 1 }}</span>
                <span class="option-label">{{ video.label }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="hero-content px-4 sm:px-6 lg:px-12">
        <div class="container mx-auto max-w-[1400px]">
          <div class="hero-badge reveal">
            <span class="badge-dot" />
            <span class="text-[10px] sm:text-xs">Premium Collection 2026</span>
          </div>
          
          <h1 class="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            <span class="title-line reveal" style="--delay: 0.1s">AutoLux</span>
            <span class="title-line accent reveal" style="--delay: 0.2s">Premium</span>
            <span class="title-line reveal hidden sm:block" style="--delay: 0.3s">Inventory</span>
          </h1>
          
          <p class="hero-subtitle text-sm sm:text-base lg:text-lg reveal max-w-full sm:max-w-md lg:max-w-lg" style="--delay: 0.4s">
            Curated luxury vehicles for the distinguished few. 
            Where precision engineering meets unparalleled elegance.
          </p>
          
          <div class="hero-actions reveal flex-col sm:flex-row gap-4" style="--delay: 0.5s">
            <router-link to="/cars" class="btn-primary w-full sm:w-auto justify-center">
              <span>Explore Inventory</span>
              <v-icon icon="mdi-arrow-right" size="20" />
            </router-link>
            <button class="btn-text w-full sm:w-auto justify-center" @click="scrollToSection('showcase')">
              <v-icon icon="mdi-play-circle-outline" size="24" />
              <span>View Collections</span>
            </button>
          </div>
        </div>
      </div>

      <div class="scroll-indicator hidden sm:flex" @click="scrollToSection('showcase')">
        <div class="mouse">
          <div class="wheel" />
        </div>
        <span class="text-[10px]">Scroll Down</span>
      </div>
    </section>

    <!-- Brand Strip - With Logos -->
    <section class="brand-strip py-8 lg:py-12">
      <div class="brand-track">
        <div class="brand-content">
          <div v-for="(brand, i) in brandLogos" :key="'a'+i" class="brand-item">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
            <span class="brand-name text-sm sm:text-base lg:text-xl">{{ brand.name }}</span>
          </div>
          <div class="brand-divider" />
          <div v-for="(brand, i) in brandLogos" :key="'b'+i" class="brand-item">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
            <span class="brand-name text-sm sm:text-base lg:text-xl">{{ brand.name }}</span>
          </div>
          <div class="brand-divider" />
        </div>
        <div class="brand-content" aria-hidden="true">
          <div v-for="(brand, i) in brandLogos" :key="'c'+i" class="brand-item">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
            <span class="brand-name text-sm sm:text-base lg:text-xl">{{ brand.name }}</span>
          </div>
          <div class="brand-divider" />
          <div v-for="(brand, i) in brandLogos" :key="'d'+i" class="brand-item">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
            <span class="brand-name text-sm sm:text-base lg:text-xl">{{ brand.name }}</span>
          </div>
          <div class="brand-divider" />
        </div>
      </div>
    </section>

    <!-- Showcase Section - Mobile Optimized -->
    <section id="showcase" class="showcase py-12 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto max-w-[1400px]">
        <div class="section-header mb-8 lg:mb-12">
          <span class="section-eyebrow text-[10px] sm:text-xs">Featured Vehicles</span>
          <h2 class="section-title text-2xl sm:text-3xl lg:text-4xl">The Collection</h2>
        </div>

        <!-- Loading State -->
        <div v-if="carsStore.loading" class="flex justify-center items-center py-12 lg:py-20">
          <div class="w-10 h-10 lg:w-12 lg:h-12 border border-white/20 border-t-white animate-spin" />
        </div>

        <!-- Content State -->
        <template v-else>
          <!-- Empty State -->
          <div v-if="featuredCars.length === 0" class="text-center py-12 lg:py-20">
            <div class="w-16 h-16 lg:w-20 lg:h-20 border border-white/10 flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <v-icon icon="mdi-car-off" size="24" class="text-gray-600" />
            </div>
            <h3 class="text-xl lg:text-2xl font-light mb-2">No vehicles available</h3>
            <p class="text-gray-500 text-sm">Check back soon for new arrivals</p>
          </div>

          <!-- Mobile: Grid Layout -->
          <div v-else-if="isMobile" class="block lg:hidden">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="car in featuredCars.slice(0, 4)" 
                :key="car.id"
                class="showcase-card-mobile"
              >
                <router-link :to="`/cars/${car.id}`" class="block">
                  <div class="aspect-[4/3] overflow-hidden bg-gray-900 relative">
                    <img :src="car.images?.[0] || '/no-image.jpg'" :alt="`${car.brand} ${car.model}`" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span v-if="getCarBadge(car)" class="absolute top-3 left-3 px-2 py-1 bg-white text-black text-[10px] uppercase font-semibold">
                      {{ getCarBadge(car) }}
                    </span>
                  </div>
                  <div class="p-4 bg-[#18181b] border border-white/5">
                    <div class="flex items-center gap-2 text-[10px] text-gray-500 uppercase mb-2">
                      <span>{{ car.year }}</span>
                      <span class="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{{ car.category }}</span>
                    </div>
                    <h3 class="text-base font-medium text-white mb-2">{{ car.brand }} {{ car.model }}</h3>
                    <p class="text-sm text-[#c9a962] font-semibold">${{ formatPrice(car.price) }}</p>
                  </div>
                </router-link>
              </div>
            </div>
            <div class="mt-6 text-center">
              <router-link to="/cars" class="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                View All Inventory
                <v-icon icon="mdi-arrow-right" size="14" />
              </router-link>
            </div>
          </div>

          <!-- Desktop: Swiper Carousel -->
          <Swiper
            v-else
            :modules="modules"
            :slides-per-view="3.5"
            :space-between="16"
            :loop="true"
            :centered-slides="false"
            :grab-cursor="true"
            :speed="800"
            :autoplay="{ delay: 4000, disableOnInteraction: false }"
            :breakpoints="swiperBreakpoints"
            class="showcase-swiper hidden lg:block"
          >
            <SwiperSlide 
              v-for="car in featuredCars" 
              :key="car.id"
              class="showcase-slide"
            >
              <div class="showcase-card">
                <div class="card-image">
                  <img :src="car.images?.[0] || '/no-image.jpg'" :alt="`${car.brand} ${car.model}`" />
                  <div class="card-overlay" />
                  <span class="card-badge" v-if="getCarBadge(car)">{{ getCarBadge(car) }}</span>
                </div>
                <div class="card-content">
                  <div class="card-meta">
                    <span>{{ car.year }}</span>
                    <span class="dot" />
                    <span>{{ car.category }}</span>
                  </div>
                  <h3 class="card-title">{{ car.brand }} {{ car.model }}</h3>
                  <div class="card-footer">
                    <p class="card-price">${{ formatPrice(car.price) }}</p>
                    <router-link :to="`/cars/${car.id}`" class="btn-icon">
                      <v-icon icon="mdi-arrow-right" />
                    </router-link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </template>
      </div>
    </section>
<!-- Market Activity Section - Replaces News -->
<section class="market-activity py-16 lg:py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
  <!-- Background -->
  <div class="activity-bg-pattern absolute inset-0 opacity-20" />
  
  <div class="container mx-auto max-w-[1400px] relative z-10">
    <!-- Header -->
    <div class="section-header mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="header-line w-12 h-px bg-gradient-to-r from-[#c9a962] to-transparent" />
          <span class="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c9a962] font-medium">
            Market Pulse
          </span>
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
          Recent <span class="text-[#c9a962] italic font-serif">Activity</span>
        </h2>
        <p class="text-gray-400 mt-3 text-sm lg:text-base max-w-lg">
          Track our latest acquisitions and upcoming arrivals. Premium vehicles move quickly.
        </p>
      </div>
      
      <!-- Live Indicator -->
      <div class="flex items-center gap-4">
        <div class="live-indicator flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span class="text-xs text-gray-400 tracking-wider">LIVE UPDATES</span>
        </div>
        
        <router-link 
          to="/cars" 
          class="hidden sm:flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
        >
          View Inventory
          <v-icon icon="mdi-arrow-right" size="14" />
        </router-link>
      </div>
    </div>

    <!-- Activity Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Featured: Just Sold -->
      <div class="lg:col-span-5">
        <div class="activity-card featured group cursor-pointer" @click="router.push('/cars')">
          <div class="relative h-[300px] lg:h-full min-h-[400px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800" 
              alt="Recently Sold"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <!-- Sold Badge -->
            <div class="absolute top-6 left-6">
              <span class="px-3 py-1.5 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <v-icon icon="mdi-check-circle" size="12" />
                Just Sold
              </span>
            </div>
            
            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div class="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <v-icon icon="mdi-clock-outline" size="12" />
                  2 hours ago
                </span>
                <span class="w-1 h-1 bg-gray-600 rounded-full" />
                <span class="text-[#c9a962]">$285,000</span>
              </div>
              <h3 class="text-xl lg:text-2xl font-light mb-2">2023 Ferrari F8 Tributo</h3>
              <p class="text-sm text-gray-400 mb-4">3.9L V8 Twin-Turbo • 710 HP • 2,400 miles</p>
              
              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                  <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-black flex items-center justify-center text-[10px]">
                    <v-icon icon="mdi-account" size="12" class="text-gray-400" />
                  </div>
                </div>
                <span class="text-xs text-gray-500">4 interested buyers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Cards -->
      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Incoming -->
        <div class="activity-card group cursor-pointer" @click="showNotifyModal = true">
          <div class="relative h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600" 
              alt="Incoming"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div class="absolute top-4 left-4">
              <span class="px-2 py-1 bg-[#c9a962] text-black text-[10px] font-bold uppercase tracking-wider">
                Arriving Soon
              </span>
            </div>
            
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h4 class="font-medium mb-1">2024 Mercedes-AMG GT 63 S</h4>
              <p class="text-xs text-gray-400">Expected: March 15</p>
            </div>
          </div>
          <div class="p-4 bg-white/[0.02] border border-white/5 border-t-0">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">831 HP Hybrid</span>
              <button class="text-[#c9a962] text-xs uppercase tracking-wider hover:underline">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        <!-- Price Drop -->
        <div class="activity-card group cursor-pointer" @click="router.push('/cars')">
          <div class="relative h-48 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/34244269/pexels-photo-34244269.jpeg" 
              alt="Price Drop"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div class="absolute top-4 left-4">
              <span class="px-2 py-1 bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <v-icon icon="mdi-trending-down" size="10" />
                Price Drop
              </span>
            </div>
            
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h4 class="font-medium mb-1">2022 BMW M5 CS</h4>
              <p class="text-xs text-gray-400">
                <span class="line-through text-gray-600">$145,000</span>
                <span class="text-[#c9a962] ml-2">$132,000</span>
              </p>
            </div>
          </div>
          <div class="p-4 bg-white/[0.02] border border-white/5 border-t-0">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">627 HP • 8,200 miles</span>
              <span class="text-xs text-red-400">-9% today</span>
            </div>
          </div>
        </div>

        <!-- New Arrival -->
        <div class="activity-card group cursor-pointer sm:col-span-2" @click="router.push('/cars')">
          <div class="flex flex-col sm:flex-row">
            <div class="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/36159652/pexels-photo-36159652.jpeg" 
                alt="New Arrival"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 sm:bg-gradient-to-l" />
              
              <div class="absolute top-4 left-4">
                <span class="px-2 py-1 bg-blue-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
                  New Listing
                </span>
              </div>
            </div>
            
            <div class="flex-1 p-4 sm:p-6 bg-white/[0.02] border border-white/5 border-t-0 sm:border-t sm:border-l-0 flex flex-col justify-center">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-medium text-lg">2024 Porsche 911 Carrera GTS</h4>
                  <p class="text-sm text-gray-400">T-Hybrid • 532 HP</p>
                </div>
                <span class="text-[#c9a962] font-semibold">$178,500</span>
              </div>
              
              <p class="text-xs text-gray-500 mb-4 line-clamp-2">
                First hybrid 911 with revolutionary eTurbo technology. Delivery miles only, factory warranty.
              </p>
              
              <div class="flex items-center gap-4 mt-auto">
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <v-icon icon="mdi-eye" size="12" />
                  234 views today
                </div>
                <div class="flex items-center gap-1 text-xs text-yellow-500">
                  <v-icon icon="mdi-star" size="12" />
                  Featured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 border-t border-white/10 pt-8">
      <div v-for="stat in activityStats" :key="stat.label" class="text-center group cursor-default">
        <div class="text-2xl lg:text-3xl font-light text-white mb-1 group-hover:text-[#c9a962] transition-colors">{{ stat.value }}</div>
        <div class="text-[10px] uppercase tracking-wider text-gray-500">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</section>

<!-- Notify Me Modal (Simple) -->
<Transition name="fade">
  <div v-if="showNotifyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="showNotifyModal = false">
    <div class="bg-[#18181b] border border-white/10 p-6 lg:p-8 max-w-md w-full">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-light">&nbsp;Get Notified</h3>
        <button @click="showNotifyModal = false" class="text-gray-400 hover:text-white">
          <v-icon icon="mdi-close" size="24" />
        </button>
      </div>
      <p class="text-gray-400 text-sm mb-6">&nbsp;&nbsp;We'll notify you when the 2024 Mercedes-AMG GT 63 S arrives.</p>
      <input 
        type="email" 
        placeholder="Enter your email"
        class="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm mb-4 focus:border-[#c9a962] outline-none transition-colors"
      />
      <button 
        @click="showNotifyModal = false"
        class="w-full bg-[#c9a962] text-black py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors"
      >
        Notify Me
      </button>
    </div>
  </div>
</Transition>
<!-- Experience Section - Enhanced Premium Design -->
<section class="experience py-16 lg:py-32 relative overflow-hidden">
  <!-- Animated Background -->
  <div class="exp-bg absolute inset-0">
    <img 
      src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=2574&auto=format&fit=crop" 
      alt="Luxury Interior" 
      class="w-full h-full object-cover"
    />
    <div class="exp-bg-overlay" />
    <div class="exp-bg-gradient" />
    <div class="exp-bg-pattern" />
  </div>

  <!-- Floating Decorative Elements -->
  <div class="floating-elements">
    <div class="floating-circle circle-1" />
    <div class="floating-circle circle-2" />
    <div class="floating-line line-1" />
    <div class="floating-line line-2" />
  </div>

  <div class="exp-content relative z-10 px-4 sm:px-6 lg:px-12">
    <div class="container mx-auto max-w-[1400px]">
      
      <!-- Section Header -->
      <div class="exp-header mb-12 lg:mb-20 text-center lg:text-left">
        <div class="flex items-center gap-3 mb-4 justify-center lg:justify-start">
          <div class="header-line" />
          <span class="section-eyebrow text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c9a962]">
            The AutoLux Experience
          </span>
        </div>
        <h2 class="exp-title text-3xl sm:text-4xl lg:text-6xl font-light mb-4 tracking-tight">
          Beyond the <span class="text-[#c9a962] italic">Ordinary</span>
        </h2>
        <p class="exp-desc text-sm lg:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Every vehicle in our collection undergoes a rigorous 200-point inspection. 
          We don't just sell cars; we deliver peace of mind.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- Left Column: Interactive Features -->
        <div class="lg:col-span-7 space-y-4">
          <div 
            v-for="(feat, i) in expFeatures" 
            :key="i"
            class="exp-feature-card group"
            :class="{ 'active': activeFeature === i }"
            @mouseenter="activeFeature = i"
            @mouseleave="activeFeature = null"
          >
            <div class="feature-number">0{{ i + 1 }}</div>
            <div class="feature-content">
              <div class="feature-header">
                <div class="feature-icon-wrapper">
                  <v-icon :icon="feat.icon" size="24" class="feature-icon" />
                </div>
                <h4 class="feature-title">{{ feat.title }}</h4>
              </div>
              <p class="feature-description">{{ feat.desc }}</p>
              <div class="feature-expand">
                <span class="expand-text">Learn more</span>
                <v-icon icon="mdi-arrow-right" size="14" class="expand-icon" />
              </div>
            </div>
            <div class="feature-glow" />
            <div class="feature-border" />
          </div>

          <!-- Additional Trust Indicators -->
          <div class="trust-indicators mt-8 grid grid-cols-3 gap-4">
            <div class="trust-item">
              <v-icon icon="mdi-shield-star" size="20" class="text-[#c9a962] mb-2" />
              <span class="trust-label">Certified</span>
            </div>
            <div class="trust-item">
              <v-icon icon="mdi-certificate" size="20" class="text-[#c9a962] mb-2" />
              <span class="trust-label">Warranty</span>
            </div>
            <div class="trust-item">
              <v-icon icon="mdi-handshake" size="20" class="text-[#c9a962] mb-2" />
              <span class="trust-label">Trusted</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Dynamic Stats & Visual -->
        <div class="lg:col-span-5 lg:sticky lg:top-32">
          <div class="stats-container">
            <!-- Main Stat Highlight -->
            <div class="main-stat">
              <div class="stat-ring">
                <div class="stat-ring-progress" :style="{ '--progress': '85%' }" />
                <div class="stat-ring-inner">
                  <span class="stat-value-large">200+</span>
                  <span class="stat-label-large">Point Check</span>
                </div>
              </div>
            </div>

            <!-- Secondary Stats Grid -->
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-icon">
                  <v-icon icon="mdi-calendar-check" size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.yearsExperience }}+</span>
                  <span class="stat-text">Years of Excellence</span>
                </div>
              </div>
              <div class="stat-box highlight">
                <div class="stat-icon">
                  <v-icon icon="mdi-car-multiple" size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.totalCars }}</span>
                  <span class="stat-text">Curated Vehicles</span>
                </div>
              </div>
              <div class="stat-box wide">
                <div class="satisfaction-meter">
                  <div class="meter-header">
                    <span>Customer Satisfaction</span>
                    <span class="meter-value">98%</span>
                  </div>
                  <div class="meter-bar">
                    <div class="meter-fill" style="width: 98%" />
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Card -->
            <div class="exp-cta-card">
              <div class="cta-content">
                <h5 class="cta-title-sm">Ready to experience luxury?</h5>
                <p class="cta-desc-sm">Schedule your private viewing today</p>
              </div>
              <router-link to="/contact" class="cta-btn">
                <span>Book Now</span>
                <v-icon icon="mdi-calendar" size="16" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Quote -->
      <div class="exp-quote mt-16 lg:mt-24 text-center">
        <div class="quote-mark">"</div>
        <p class="quote-text text-lg lg:text-2xl font-light italic text-gray-300 max-w-3xl mx-auto">
          Excellence is not a destination, but a continuous journey that never ends.
        </p>
        <div class="quote-author mt-4">
          <span class="text-[#c9a962] text-sm">— AutoLux Philosophy</span>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- CTA Section - Mobile Optimized -->
    <section class="cta-section py-16 lg:py-24 px-4 sm:px-6 lg:px-12 text-center relative">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 lg:h-24 bg-gradient-to-b from-[#c9a962] to-transparent" />
      <h2 class="cta-title text-2xl sm:text-3xl lg:text-4xl mb-3 lg:mb-4">Begin Your Journey</h2>
      <p class="cta-subtitle text-sm lg:text-base text-gray-400 mb-6 lg:mb-8 max-w-md mx-auto">Schedule a private consultation with our automotive specialists</p>
      <router-link to="/contact" class="btn-primary inline-flex w-full sm:w-auto justify-center">
        <span>Book Appointment</span>
        <v-icon icon="mdi-calendar" size="20" />
      </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNewsStore } from '@/stores/news'
import Lenis from 'lenis'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import { useCarsStore } from '@/stores/cars'
import type { Car } from '@/types'
import 'swiper/css'
import 'swiper/css/effect-coverflow'

const modules = [Autoplay]
const carsStore = useCarsStore()
const newsStore = useNewsStore()


const loading = ref(true)
const loadProgress = ref(0)
const scrollProgress = ref(0)
const rpm = ref(0)
const isMobile = ref(false)

// Video Selector State
const selectorExpanded = ref(false)
const currentVideoIndex = ref(0)
const heroVideo = ref<HTMLVideoElement | null>(null)
const videoLoading = ref(false)
const trendingTags = [
  'Electric Vehicles',
  'Supercars',
  'BMW',
  'Mercedes',
  'Ferrari',
  'Porsche',
  'Autonomous',
  'Concept Cars'
]

// Video Options - Pexels Direct URLs
const videoOptions = [
  {
    url: 'https://www.pexels.com/download/video/30678639/',
    poster: 'https://1000logos.net/wp-content/uploads/2018/02/BMW-Logo-1997.png',
    thumbnail: 'https://1000logos.net/wp-content/uploads/2018/02/BMW-Logo-1997.png',
    label: 'BMW'
  },
  {
    url: 'https://www.pexels.com/download/video/857194/',
    poster: 'https://1000logos.net/wp-content/uploads/2018/04/Mercedes-Benz-Logo.png',
    thumbnail: 'https://1000logos.net/wp-content/uploads/2018/04/Mercedes-Benz-Logo.png',
    label: 'Mercedes Benz'
  },
  {
    url: 'https://www.pexels.com/download/video/4569076/',
    poster: 'https://pngimg.com/uploads/porsche_logo/porsche_logo_PNG7.png',
    thumbnail: 'https://pngimg.com/uploads/porsche_logo/porsche_logo_PNG7.png',
    label: 'Porsche'
  },
  {
    url: 'https://www.pexels.com/download/video/5309351/',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPp1o_C14c1A67DbLm4hN_BqosyOsF-qKYQ&s',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPp1o_C14c1A67DbLm4hN_BqosyOsF-qKYQ&s',
    label: 'Ferrari'
  }
]

const currentVideo = computed(() => videoOptions[currentVideoIndex.value])

const selectVideo = (index: number) => {
  if (index === currentVideoIndex.value || videoLoading.value) return
  
  videoLoading.value = true
  currentVideoIndex.value = index
  
  // Smooth transition effect
  if (heroVideo.value) {
    heroVideo.value.style.opacity = '0.5'
    heroVideo.value.style.transition = 'opacity 0.5s ease'
    
    setTimeout(() => {
      heroVideo.value?.load()
    }, 300)
  }
}

const onVideoLoaded = () => {
  videoLoading.value = false
  if (heroVideo.value) {
    heroVideo.value.style.opacity = '1'
    heroVideo.value.play().catch(() => {
      // Autoplay blocked, show poster
    })
  }
}
const activeFeature= ref(null)
// Brand Logos Data
const brandLogos = [
  { 
    name: 'Ferrari', 
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPp1o_C14c1A67DbLm4hN_BqosyOsF-qKYQ&s'
  },
  { 
    name: 'BMW', 
    logo: 'https://1000logos.net/wp-content/uploads/2018/02/BMW-Logo-1997.png'
  },
  { 
    name: 'Mercedes-Benz', 
    logo: 'https://1000logos.net/wp-content/uploads/2018/04/Mercedes-Benz-Logo.png'
  },
  { 
    name: 'Porsche', 
    logo: 'https://pngimg.com/uploads/porsche_logo/porsche_logo_PNG7.png'
  },
  { 
    name: 'Lamborghini', 
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Lamborghini-Logo.png'
  },
  { 
    name: 'Audi', 
    logo: 'https://www.freepnglogos.com/uploads/audi-logo-2.png'
  },
  { 
    name: 'Bentley', 
    logo: 'https://pngimg.com/d/bentley_PNG21.png'
  },
  { 
    name: 'Rolls-Royce', 
    logo: 'https://icon2.cleanpng.com/20180716/rez/kisspng-rolls-royce-holdings-plc-rolls-royce-phantom-vii-r-rolls-royce-logo-5b4c4d1bc0db54.70692860153172713179.jpg'
  }
]
const showNotifyModal = ref(false)

const activityStats = [
  { value: "12", label: "Sold This Week" },
  { value: "8", label: "Arriving Soon" },
  { value: "3", label: "Price Drops" },
  { value: "24h", label: "Avg. Time to Sale" }
]

const needleRotation = computed(() => {
  return -120 + (rpm.value / 8) * 240
})

let lenis: Lenis | null = null
let rafId: number
let rpmInterval: number | null = null

const statusMessages = [
  'Ignition',
  'Starting Engine',
  'Building Pressure',
  'Revving Up',
  'Revs Your Heart',
  'Launch Control Active'
]

const loadingStatus = computed(() => {
  const index = Math.min(Math.floor((loadProgress.value / 100) * statusMessages.length), statusMessages.length - 1)
  return statusMessages[index]
})

const stats = ref({
  yearsExperience: 15,
  inspectionPoints: 200,
  totalCars: 0
})

const expFeatures = [
  { icon: 'mdi-shield-check', title: 'Certified Pre-Owned', desc: 'Rigorous inspection process' },
  { icon: 'mdi-certificate', title: 'Extended Warranty', desc: 'Up to 5 years coverage' },
  { icon: 'mdi-hand-coin', title: 'Trade-In Program', desc: 'Competitive valuations' },
]

const featuredCars = computed<Car[]>(() => {
  return carsStore.featuredCars.map(car => ({
    ...car,
    images: car.images || ['/no-image.jpg']
  }))
})

const formatPrice = (price: number): string => {
  return price?.toLocaleString('en-US') || '0'
}

const getCarBadge = (car: Car): string | null => {
  if (car.status === 'sold') return 'Sold'
  if (car.status === 'reserved') return 'Reserved'
  if (car.views && car.views > 100) return 'Popular'
  if (car.createdAt) {
    const createdDate = new Date(car.createdAt)
    const daysDiff = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff < 7) return 'New Arrival'
  }
  return null
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const refreshNews = () => {
  newsStore.fetchNews(true) // Force refresh
}

const openArticle = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/no-image.jpg' // Fallback image
}

const searchByTag = (tag: string) => {
  const query = encodeURIComponent(tag + ' cars automotive')
  window.open(`https://news.google.com/search?q=${query}`, '_blank')
}

onMounted(async () => {
   newsStore.fetchNews()
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const targetRPM = 8
  const revDuration = 2500
  const startTime = Date.now()

  rpmInterval = window.setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / revDuration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    rpm.value = targetRPM * easeOutQuart
    loadProgress.value = progress * 100
    
    if (progress >= 1) {
      if (rpmInterval) clearInterval(rpmInterval)
      setTimeout(() => {
        loading.value = false
      }, 800)
    }
  }, 16)

  await carsStore.fetchCars()
  stats.value.totalCars = carsStore.cars.length

  // Only initialize Lenis on desktop
  if (window.innerWidth >= 1024) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      scrollProgress.value = progress
    })

    const raf = (time: number) => {
      lenis?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

const swiperBreakpoints = computed(() => ({
  1024: {
    slidesPerView: 3.2,
    spaceBetween: 20
  },
  1280: {
    slidesPerView: 3.5,
    spaceBetween: 24
  },
  1536: {
    slidesPerView: 4,
    spaceBetween: 30
  }
}))

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  if (rpmInterval) clearInterval(rpmInterval)
})

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    if (lenis) {
      lenis.scrollTo(el, { offset: -50 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Orbitron:wght@400;500;700&display=swap');

:root {
  --color-bg: #09090b;
  --color-surface: #18181b;
  --color-surface-light: #27272a;
  --color-primary: #c9a962;
  --color-text: #ffffff;
  --color-text-dim: #a1a1aa;
  --color-accent: #3b82f6;
  --color-redline: #ef4444;
  --font-display: 'Playfair Display', serif;
  --font-ui: 'Inter', sans-serif;
  --font-tech: 'Orbitron', sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-wrapper {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui);
  overflow-x: hidden;
}

// Preloader - Mobile Optimized
.preloader {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(201, 169, 98, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
}

.tachometer {
  position: relative;
  width: 200px;
  height: 200px;
  
  @media (min-width: 640px) {
    width: 240px;
    height: 240px;
  }
  
  @media (min-width: 1024px) {
    width: 280px;
    height: 280px;
  }
  
  .tacho-outer-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 180deg, #1a1a1a 0deg, #0a0a0a 120deg, #1a1a1a 180deg, #0a0a0a 240deg, #1a1a1a 360deg);
    box-shadow: 0 0 0 2px #222, 0 0 0 4px #000, 0 20px 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5);
  }
  
  .tacho-marks {
    position: absolute;
    inset: 15px;
    border-radius: 50%;
    
    .mark {
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 8px;
      background: #444;
      transform-origin: center 85px;
      margin-left: -1px;
      
      @media (min-width: 640px) {
        transform-origin: center 105px;
        height: 10px;
      }
      
      @media (min-width: 1024px) {
        transform-origin: center 125px;
        height: 12px;
      }
      
      &:nth-child(3n) {
        height: 12px;
        background: #666;
        
        @media (min-width: 640px) { height: 15px; }
        @media (min-width: 1024px) { height: 18px; }
      }
    }
  }
  
  .tacho-numbers {
    position: absolute;
    inset: 30px;
    
    .num {
      position: absolute;
      font-family: var(--font-tech);
      font-size: 0.875rem;
      font-weight: 500;
      color: #888;
      
      @media (min-width: 640px) { font-size: 1rem; }
      @media (min-width: 1024px) { font-size: 1.25rem; }
      
      &.num-0 { bottom: 5%; left: 50%; transform: translateX(-50%); }
      &.num-1 { bottom: 20%; left: 12%; }
      &.num-2 { top: 50%; left: 2%; transform: translateY(-50%); }
      &.num-3 { top: 15%; left: 12%; }
      &.num-4 { top: 5%; left: 50%; transform: translateX(-50%); }
      &.num-5 { top: 15%; right: 12%; }
      &.num-6 { top: 50%; right: 2%; transform: translateY(-50%); }
      &.num-7 { bottom: 20%; right: 12%; color: #ff8800; }
      &.num-8 { bottom: 5%; right: 50%; transform: translateX(50%); color: var(--color-redline); }
    }
  }
  
  .tacho-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%);
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    
    @media (min-width: 640px) { width: 70px; height: 70px; }
    @media (min-width: 1024px) { width: 80px; height: 80px; }
    
    .tacho-icon {
      color: var(--color-primary);
      filter: drop-shadow(0 0 8px rgba(201, 169, 98, 0.5));
    }
  }
  
  .tacho-needle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px;
    height: 70px;
    margin-left: -1.5px;
    margin-top: -70px;
    transform-origin: bottom center;
    transition: transform 0.05s ease-out;
    z-index: 10;
    
    @media (min-width: 640px) { height: 85px; margin-top: -85px; }
    @media (min-width: 1024px) { width: 4px; height: 100px; margin-left: -2px; margin-top: -100px; }
    
    .needle-body {
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, #c9a962 0%, #fff 50%, #c9a962 100%);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(201, 169, 98, 0.8);
    }
    
    .needle-pivot {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff 0%, #c9a962 100%);
      box-shadow: 0 0 10px rgba(201, 169, 98, 0.8);
      
      @media (min-width: 1024px) { width: 16px; height: 16px; bottom: -8px; }
    }
  }
  
  .tacho-glass {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }
}

.loading-status {
  width: 160px;
  
  @media (min-width: 640px) { width: 180px; }
  @media (min-width: 1024px) { width: 200px; }
  
  .status-text {
    font-family: var(--font-tech);
    font-size: 0.625rem;
    color: #666;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    text-align: center;
    
    &.revving { color: var(--color-primary); }
  }
  
  .status-bar {
    height: 2px;
    background: #222;
    overflow: hidden;
    
    .status-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-redline));
      transition: width 0.1s linear;
    }
  }
}

.fade-leave-active { 
  transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out); 
}
.fade-leave-to { 
  opacity: 0; 
  transform: scale(1.05);
}

.nav-progress {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  z-index: 9998;
  transform-origin: left;
  transform: scaleX(0);
}

// Hero Section - Mobile First with Video
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 1024px) {
    min-height: 100vh;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  
  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.5) contrast(1.1);
    
    @media (min-width: 640px) {
      filter: brightness(0.6) contrast(1.1);
    }
  }
  
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.5) contrast(1.1);
    
    @media (min-width: 640px) {
      filter: brightness(0.6) contrast(1.1);
    }
  }
  
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%);
    
    @media (min-width: 640px) {
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
    }
  }
  
  // Additional cinematic gradient overlay
  .hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
    pointer-events: none;
  }
}

// Video Selector Styles
.video-selector {
  position: absolute;
  top: 100px;
  right: 1rem;
  z-index: 10;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s var(--ease-out);
  max-width: 280px;
  
  @media (min-width: 640px) {
    top: 120px;
    right: 2rem;
    max-width: 320px;
  }
  
  @media (min-width: 1024px) {
    top: 140px;
    right: 3rem;
  }
  
  &.expanded {
    background: rgba(9, 9, 11, 0.95);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  }
}

.selector-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;  
  transition: all 0.3s;
  border-bottom: 1px solid transparent;
  
  @media (min-width: 640px) {
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
  }
  
  &:hover {
    color: var(--color-primary);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .video-selector.expanded & {
    border-bottom-color: rgba(255, 255, 255, 0.1);
    color: var(--color-primary);
  }
}

.selector-panel {
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1.25rem;
  }
}

.selector-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.video-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.video-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  
  @media (min-width: 640px) {
    gap: 1rem;
    padding: 0.75rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateX(-4px);
  }
  
  &.active {
    background: rgba(201, 169, 98, 0.1);
    border-color: var(--color-primary);
    
    .option-number {
      color: var(--color-primary);
    }
  }
}

.option-thumbnail {
  position: relative;
  width: 60px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  
  @media (min-width: 640px) {
    width: 80px;
    height: 50px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .video-option:hover & img {
    transform: scale(1.1);
  }
}

.option-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  
  .video-option:hover &,
  .video-option.active & {
    opacity: 1;
  }
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-number {
  font-family: var(--font-tech);
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  
  @media (min-width: 640px) {
    font-size: 0.75rem;
  }
}

.option-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  letter-spacing: 0.02em;
  
  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-top: 80px;
  
  @media (min-width: 640px) {
    padding-top: 0;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  margin-bottom: 1.5rem;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  @media (min-width: 640px) {
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    margin-bottom: 2rem;
    font-size: 0.75rem;
  }
  
  .badge-dot {
    width: 6px;
    height: 6px;
    background: var(--color-primary);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 400;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  
  @media (min-width: 640px) {
    margin-bottom: 2rem;
  }
  
  .title-line {
    display: block;
    overflow: hidden;
    
    &.accent {
      color: var(--color-primary);
      font-style: italic;
    }
  }
}

.hero-subtitle {
  color: var(--color-text-dim);
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    line-height: 1.8;
    margin-bottom: 3rem;
  }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  
  @media (min-width: 640px) {
    gap: 1.5rem;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--color-primary);
  color: #e0d6d6;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  transition: all 0.4s var(--ease-out);
  position: relative;
  overflow: hidden;
  
  @media (min-width: 640px) {
    gap: 0.75rem;
    padding: 1.25rem 2.5rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    transform: translateX(-101%);
    transition: transform 0.4s var(--ease-out);
    z-index: -1;
  }
  
  &:hover {
    color: white;
    box-shadow: 0 0 30px rgba(201, 169, 98, 0.4);
    
    &::before { transform: translateX(0); }
  }
}

.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.3s;
  
  @media (min-width: 640px) {
    gap: 0.75rem;
  }
  
  &:hover { color: var(--color-primary); }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-dim);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  
  .mouse {
    width: 24px;
    height: 40px;
    border: 1px solid currentColor;
    border-radius: 12px;
    position: relative;
    
    .wheel {
      width: 2px;
      height: 8px;
      background: currentColor;
      border-radius: 2px;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 2s infinite;
    }
  }
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out);
  transition-delay: var(--delay, 0s);
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

// Brand Strip
.brand-strip {
  padding: 2rem 0;
  background: var(--color-bg);
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  
  @media (min-width: 1024px) {
    padding: 4rem 0;
  }
  
  .brand-track {
    display: flex;
    width: max-content;
    animation: marquee 35s linear infinite; // Slightly slower for images
    
    @media (min-width: 1024px) {
      animation: marquee 40s linear infinite;
    }
  }
  
  .brand-content {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    
    @media (min-width: 1024px) {
      padding: 0 2rem;
    }
  }
  
  .brand-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.5rem;
    transition: opacity 0.3s;
    white-space: nowrap;
    
    @media (min-width: 640px) {
      padding: 0 2rem;
      gap: 1rem;
    }
    
    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .brand-logo {
    height: 20px;
    width: auto;
    object-fit: contain;
    opacity: 0.8;
    transition: opacity 0.3s;
    
    @media (min-width: 640px) { height: 24px; }
    @media (min-width: 1024px) { height: 32px; }
    
    &:hover {
      opacity: 1;
    }
  }
  
  .brand-name {
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--color-text-dim);
  }
  
  .brand-divider {
    width: 4px;
    height: 4px;
    background: var(--color-primary);
    border-radius: 50%;
    
    @media (min-width: 1024px) {
      width: 6px;
      height: 6px;
    }
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

// Showcase Section
.showcase {
  background: linear-gradient(180deg, var(--color-bg) 0%, #0f0f12 100%);
}

.section-header {
  text-align: center;
  
  .section-eyebrow {
    display: block;
    letter-spacing: 0.3em;
    color: var(--color-primary);
    margin-bottom: 0.75rem;
    
    @media (min-width: 640px) {
      margin-bottom: 1rem;
    }
  }
  
  .section-title {
    font-family: var(--font-display);
    font-weight: 400;
  }
}

// Mobile Cards
.showcase-card-mobile {
  transition: transform 0.3s;
  
  &:active {
    transform: scale(0.98);
  }
}

// Desktop Swiper
.showcase-swiper {
  padding: 2rem 0 4rem !important;
  overflow: visible !important;
}

.showcase-slide {
  height: auto;
  
  @media (min-width: 1024px) {
    width: auto !important; // Let Swiper control width
  }
  
  @media (min-width: 1280px) {
    width: auto !important;
  }
}

.showcase-swiper {
  padding: 2rem 4rem 4rem !important; // Add side padding for continuous look
  overflow: visible !important;
}

.showcase-card {
  background: var(--color-surface);
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.4s;
  
  &:hover {
    border-color: rgba(201, 169, 98, 0.3);
    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
  }
  
  .card-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    @media (min-width: 1280px) {
      height: 280px;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1s var(--ease-out);
    }
    
    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);
    }
    
    .card-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--color-primary);
      color: #000;
      padding: 0.25rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
  }
  
  &:hover .card-image img {
    transform: scale(1.1);
  }
  
  .card-content {
    padding: 1.25rem;
    
    @media (min-width: 1280px) {
      padding: 1.5rem;
    }
  }
  
  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-text-dim);
    margin-bottom: 0.5rem;
    
    @media (min-width: 1280px) {
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .dot {
      width: 4px;
      height: 4px;
      background: var(--color-primary);
      border-radius: 50%;
    }
  }
  
  .card-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (min-width: 1280px) {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    
    @media (min-width: 1280px) {
      padding-top: 1rem;
    }
  }
  
  .card-price {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
    
    @media (min-width: 1280px) {
      font-size: 1.125rem;
    }
  }
  
  .btn-icon {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s;
    
    @media (min-width: 1280px) {
      width: 40px;
      height: 40px;
    }
    
    &:hover {
      background: white;
      color: black;
      border-color: white;
    }
  }
}

// Experience Section
.experience {
  position: relative;
}

.exp-bg {
  position: absolute;
  inset: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.exp-content {
  position: relative;
  z-index: 2;
}

.exp-text {
  .section-eyebrow.light {
    color: var(--color-primary);
  }
}

.exp-title {
  font-family: var(--font-display);
  font-weight: 400;
}

.exp-desc {
  color: var(--color-text-dim);
}

.exp-features {
  .exp-feature {
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: all 0.3s;
    
    @media (min-width: 1024px) {
      gap: 1.5rem;
      padding: 1rem;
      
      &:hover {
        border-color: rgba(201, 169, 98, 0.2);
        transform: translateX(10px);
      }
    }
  }
}

.feature-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.exp-stats {
  .stat-card {
    text-align: center;
    transition: transform 0.3s;
    
    &:active {
      transform: scale(0.98);
    }
    
    &.highlight {
      background: var(--color-primary);
      color: #000;
    }
    
    .stat-value {
      font-family: var(--font-display);
      font-weight: 400;
    }
  }
}

// CTA Section
.cta-section {
  background: linear-gradient(180deg, #0f0f12 0%, #000 100%);
  position: relative;
}

.cta-title {
  font-family: var(--font-display);
  font-weight: 400;
}

.cta-subtitle {
  color: var(--color-text-dim);
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes scroll {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(15px); }
}

// Touch device optimizations
@media (hover: none) {
  .showcase-card:hover,
  .exp-feature:hover {
    transform: none;
  }
  
  .btn-primary:hover::before {
    transform: translateX(-101%);
  }
  
  .btn-primary:active {
    transform: scale(0.98);
  }
}
// Experience Section - Enhanced Premium Design
.experience {
  position: relative;
  background: #0a0a0a;
}

.exp-bg {
  position: absolute;
  inset: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) brightness(0.3);
    transform: scale(1.1);
    animation: slowZoom 20s ease-in-out infinite alternate;
  }
}

@keyframes slowZoom {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.2); }
}

.exp-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.8) 50%, rgba(9,9,11,0.95) 100%);
}

.exp-bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(201,169,98,0.08) 0%, transparent 50%);
}

.exp-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

// Floating Elements
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(201,169,98,0.1);
  
  &.circle-1 {
    width: 300px;
    height: 300px;
    top: 10%;
    right: -100px;
    animation: float 6s ease-in-out infinite;
  }
  
  &.circle-2 {
    width: 200px;
    height: 200px;
    bottom: 20%;
    left: -50px;
    animation: float 8s ease-in-out infinite reverse;
  }
}

.floating-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(201,169,98,0.2), transparent);
  height: 1px;
  
  &.line-1 {
    width: 200px;
    top: 30%;
    left: 0;
    animation: slideLine 4s ease-in-out infinite;
  }
  
  &.line-2 {
    width: 150px;
    bottom: 40%;
    right: 0;
    animation: slideLine 5s ease-in-out infinite reverse;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes slideLine {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100vw); opacity: 0; }
}

// Header Styles
.exp-header {
  position: relative;
}

.header-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #c9a962, transparent);
}

.exp-title {
  font-family: var(--font-display);
  background: linear-gradient(135deg, #fff 0%, #c9a962 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Feature Cards
.exp-feature-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  
  &:hover, &.active {
    background: rgba(255,255,255,0.05);
    border-color: rgba(201,169,98,0.3);
    transform: translateX(10px);
    
    .feature-glow {
      opacity: 1;
    }
    
    .feature-border {
      transform: scaleY(1);
    }
    
    .feature-icon-wrapper {
      background: #c9a962;
      color: #000;
      transform: rotate(360deg);
    }
    
    .feature-expand {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.feature-number {
  font-family: var(--font-tech);
  font-size: 0.75rem;
  color: rgba(201,169,98,0.5);
  font-weight: 600;
  letter-spacing: 0.1em;
  transition: color 0.3s;
  
  .exp-feature-card:hover & {
    color: #c9a962;
  }
}

.feature-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(201,169,98,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a962;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.02em;
}

.feature-description {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-expand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #c9a962;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  .expand-icon {
    transition: transform 0.3s;
  }
  
  &:hover .expand-icon {
    transform: translateX(4px);
  }
}

.feature-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(201,169,98,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.feature-border {
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #c9a962, transparent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

// Trust Indicators
.trust-indicators {
  padding: 1.5rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.05);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.trust-label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.6);
}

// Stats Container
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-stat {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(201,169,98,0.1) 0%, transparent 70%);
  }
}

.stat-ring {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #c9a962 var(--progress), rgba(255,255,255,0.05) var(--progress));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotateRing 2s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    background: #0a0a0a;
    border-radius: 50%;
  }
}

@keyframes rotateRing {
  from { --progress: 0%; }
  to { --progress: 85%; }
}

.stat-ring-inner {
  position: relative;
  z-index: 2;
  text-align: center;
}

.stat-value-large {
  display: block;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 400;
  color: #c9a962;
  line-height: 1;
}

.stat-label-large {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.6);
  margin-top: 0.5rem;
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(201,169,98,0.2);
    transform: translateY(-2px);
  }
  
  &.highlight {
    background: rgba(201,169,98,0.1);
    border-color: rgba(201,169,98,0.3);
    
    .stat-number {
      color: #c9a962;
    }
  }
  
  &.wide {
    grid-column: 1 / -1;
  }
}

.stat-icon {
  color: rgba(255,255,255,0.4);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: #fff;
  line-height: 1;
}

.stat-text {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
  margin-top: 0.25rem;
}

// Satisfaction Meter
.satisfaction-meter {
  width: 100%;
}

.meter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 0.5rem;
}

.meter-value {
  color: #c9a962;
  font-weight: 600;
}

.meter-bar {
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #c9a962, #fff);
  border-radius: 2px;
  transition: width 1s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(0); }
  100% { transform: translateX(20px); }
}

// CTA Card
.exp-cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(201,169,98,0.1) 0%, rgba(201,169,98,0.05) 100%);
  border: 1px solid rgba(201,169,98,0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.cta-title-sm {
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  margin-bottom: 0.25rem;
}

.cta-desc-sm {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

.cta-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #c9a962;
  color: #000;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    background: #fff;
    transform: translateX(4px);
  }
}

// Quote Section
.exp-quote {
  position: relative;
  padding: 3rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,169,98,0.3), transparent);
  }
}

.quote-mark {
  font-family: var(--font-display);
  font-size: 4rem;
  color: rgba(201,169,98,0.2);
  line-height: 1;
  margin-bottom: -1rem;
}

.quote-text {
  font-family: var(--font-display);
  line-height: 1.6;
}

.quote-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  &::before, &::after {
    content: '';
    width: 30px;
    height: 1px;
    background: rgba(201,169,98,0.3);
  }
}

// Responsive Adjustments
@media (max-width: 1023px) {
  .stat-ring {
    width: 150px;
    height: 150px;
  }
  
  .stat-value-large {
    font-size: 2.5rem;
  }
  
  .exp-feature-card {
    padding: 1.25rem;
  }
  
  .feature-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 639px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-box.wide {
    grid-column: 1;
  }
  
  .exp-cta-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .quote-mark {
    font-size: 3rem;
  }
}
// News Section Styles
// News Section Styles
.trending-news {
  background: linear-gradient(180deg, #0a0a0a 0%, #09090b 100%);
  position: relative;
}

.news-bg-pattern {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
  background-size: 40px 40px;
}

.live-ticker {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(255,255,255,0.1); }
  50% { border-color: rgba(201,169,98,0.3); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Article hover glow
article {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,169,98,0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover::before {
    opacity: 1;
  }
}
// Market Activity Styles
.market-activity {
  background: linear-gradient(180deg, #0a0a0a 0%, #09090b 100%);
  position: relative;
}

.activity-bg-pattern {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(201,169,98,0.03) 1px, transparent 0);
  background-size: 30px 30px;
}

.activity-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    border-color: rgba(201,169,98,0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  
  &.featured {
    border-color: rgba(201,169,98,0.1);
    
    &:hover {
      border-color: rgba(201,169,98,0.3);
    }
  }
}

.live-indicator {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% { border-color: rgba(255,255,255,0.1); }
  50% { border-color: rgba(34,197,94,0.3); }
}

// Modal transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>