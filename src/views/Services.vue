<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">What We Offer</span>
            <h1 class="text-4xl lg:text-6xl font-light tracking-tight">
              OUR <span class="text-gray-500">SERVICES</span>
            </h1>
            <p class="text-gray-400 text-sm mt-3 font-light max-w-lg">
              Premium automotive services tailored for discerning clients. From acquisition to maintenance, we handle every detail.
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <!-- Featured Service -->
      <div class="border border-white/10 bg-white/[0.02] mb-12 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="p-8 lg:p-12 flex flex-col justify-center">
            <span class="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-4">Signature Service</span>
            <h2 class="text-3xl lg:text-4xl font-light text-white mb-4">White Glove Acquisition</h2>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              Our flagship service handles every aspect of your vehicle acquisition. From sourcing rare models to negotiating the best terms, we manage the entire process. Your dedicated consultant works exclusively for you, ensuring your exact specifications are met.
            </p>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in acquisitionFeatures" :key="feature" class="flex items-center gap-3 text-sm text-gray-300">
                <v-icon icon="mdi-check" size="16" class="text-emerald-400" />
                {{ feature }}
              </li>
            </ul>
            <router-link 
              to="/contact" 
              class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all font-medium self-start"
            >
              Inquire Now
              <v-icon icon="mdi-arrow-right" size="14" />
            </router-link>
          </div>
          <div class="relative h-64 lg:h-auto bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Car"
              class="w-full h-full object-cover opacity-80"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-l" />
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <div 
          v-for="service in services" 
          :key="service.title"
          class="bg-black p-8 hover:bg-white/[0.03] transition-all duration-300 group"
        >
          <div class="w-14 h-14 border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
            <v-icon :icon="service.icon" size="28" :class="service.iconColor" />
          </div>
          <h3 class="text-xl font-light text-white mb-3 tracking-wide">{{ service.title }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed mb-6">{{ service.description }}</p>
          <div class="space-y-2 mb-6">
            <div 
              v-for="item in service.features" 
              :key="item"
              class="flex items-center gap-2 text-xs text-gray-500"
            >
              <span class="w-1 h-1 bg-gray-600" />
              {{ item }}
            </div>
          </div>
          <router-link 
            :to="service.link"
            class="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors flex items-center gap-2 group/link"
          >
            Learn More
            <v-icon icon="mdi-arrow-right" size="12" class="group-hover/link:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </div>

      <!-- Process Section -->
      <div class="mt-16 border border-white/10 bg-white/[0.02]">
        <div class="px-6 py-4 border-b border-white/10">
          <span class="text-xs tracking-widest text-gray-500 uppercase">Our Process</span>
        </div>
        <div class="p-8 lg:p-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div 
              v-for="(step, index) in processSteps" 
              :key="step.title"
              class="relative"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 border border-white/20 flex items-center justify-center text-lg font-light text-white shrink-0">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
                <div>
                  <h4 class="text-sm font-medium text-white mb-2 uppercase tracking-wider">{{ step.title }}</h4>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ step.description }}</p>
                </div>
              </div>
              <div v-if="index < 3" class="hidden md:block absolute top-6 left-full w-full h-px bg-white/10 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 border border-white/10 p-12 text-center bg-white/[0.02]">
        <h2 class="text-2xl font-light text-white mb-4">Ready to Experience Luxury?</h2>
        <p class="text-gray-400 text-sm mb-8 max-w-md mx-auto">
          Schedule a consultation with our team and discover how we can elevate your automotive experience.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/contact" 
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-all font-medium"
          >
            <v-icon icon="mdi-calendar" size="16" />
            Book Consultation
          </router-link>
          <a 
            href="tel:+1234567890" 
            class="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 transition-all"
          >
            <v-icon icon="mdi-phone" size="16" />
            Call Us Now
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const acquisitionFeatures = [
  'Worldwide vehicle sourcing network',
  'Pre-purchase inspection & verification',
  'Negotiation & documentation handling',
  'Door-to-door delivery coordination',
  'Post-purchase concierge support'
]

const services = [
  {
    title: 'Vehicle Sourcing',
    description: 'Access to exclusive inventory and off-market vehicles. We locate your dream car anywhere in the world.',
    icon: 'mdi-magnify',
    iconColor: 'text-blue-400',
    features: ['Global network', 'Rare finds', 'Price negotiation'],
    link: '/contact'
  },
  {
    title: 'Trade-In Services',
    description: 'Maximize your current vehicle value with our competitive trade-in program and seamless transition.',
    icon: 'mdi-swap-horizontal',
    iconColor: 'text-amber-400',
    features: ['Fair appraisal', 'Instant quotes', 'Hassle-free process'],
    link: '/contact'
  },
  {
    title: 'Financing Solutions',
    description: 'Tailored financing options through our premium lending partners with exclusive rates for luxury vehicles.',
    icon: 'mdi-currency-usd',
    iconColor: 'text-emerald-400',
    features: ['Competitive rates', 'Flexible terms', 'Quick approval'],
    link: '/contact'
  },
  {
    title: 'Delivery & Logistics',
    description: 'White-glove delivery service ensuring your vehicle arrives in pristine condition, anywhere you are.',
    icon: 'mdi-truck-delivery',
    iconColor: 'text-purple-400',
    features: ['Nationwide delivery', 'Enclosed transport', 'Real-time tracking'],
    link: '/contact'
  },
  {
    title: 'Maintenance Programs',
    description: 'Comprehensive maintenance packages to keep your investment in peak condition for years to come.',
    icon: 'mdi-wrench',
    iconColor: 'text-red-400',
    features: ['Scheduled service', 'Genuine parts', 'Certified technicians'],
    link: '/contact'
  },
  {
    title: 'Concierge Services',
    description: '24/7 dedicated support for all your automotive needs, from roadside assistance to travel planning.',
    icon: 'mdi-headset',
    iconColor: 'text-cyan-400',
    features: ['24/7 availability', 'Travel planning', 'Event coordination'],
    link: '/contact'
  }
]

const processSteps = [
  {
    title: 'Consultation',
    description: 'We discuss your preferences, requirements, and budget to understand your perfect vehicle.'
  },
  {
    title: 'Sourcing',
    description: 'Our team searches globally to find vehicles matching your exact specifications.'
  },
  {
    title: 'Verification',
    description: 'Comprehensive inspection and documentation review ensuring quality and authenticity.'
  },
  {
    title: 'Delivery',
    description: 'Seamless purchase process with white-glove delivery to your preferred location.'
  }
]
</script>

<style scoped>
* {
  border-radius: 0 !important;
}

:deep(.v-icon) {
  border-radius: 0 !important;
}

::selection {
  background: white;
  color: black;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>