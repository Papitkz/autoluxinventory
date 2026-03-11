<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Our Story</span>
            <h1 class="text-4xl lg:text-6xl font-light tracking-tight">
              ABOUT <span class="text-gray-500">AUTOLUX</span>
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <span class="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-4 block">Established 2015</span>
          <h2 class="text-3xl lg:text-4xl font-light text-white mb-6 leading-tight">
            Redefining the Luxury Automotive Experience
          </h2>
          <div class="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              AutoLux was founded with a singular vision: to transform how discerning clients acquire and experience luxury automobiles. What began as a boutique consultancy has evolved into a comprehensive automotive concierge service.
            </p>
            <p>
              Our team combines decades of experience in luxury automotive sales, international logistics, and white-glove client service. We don't just sell cars—we curate exceptional automotive experiences tailored to each client's unique desires.
            </p>
            <p>
              With access to exclusive inventory worldwide and relationships with the most prestigious manufacturers, we bring your automotive dreams to reality with unparalleled professionalism and discretion.
            </p>
          </div>
          
          <div class="flex gap-8 mt-8 pt-8 border-t border-white/10">
            <div>
              <div class="text-3xl font-light text-white mb-1">500+</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wider">Vehicles Sold</div>
            </div>
            <div>
              <div class="text-3xl font-light text-white mb-1">98%</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wider">Client Satisfaction</div>
            </div>
            <div>
              <div class="text-3xl font-light text-white mb-1">15+</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wider">Countries Served</div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="aspect-[4/3] bg-gray-900 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Showroom"
              class="w-full h-full object-cover opacity-80"
            />
            <div class="absolute inset-0 ring-1 ring-white/10" />
          </div>
          <div class="absolute -bottom-6 -left-6 w-48 h-48 border border-white/10 bg-black p-6 hidden lg:flex flex-col justify-center">
            <v-icon icon="mdi-trophy" size="32" class="text-white mb-3" />
            <div class="text-xs text-gray-400 leading-tight">Award-winning service excellence since 2018</div>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="border border-white/10 bg-white/[0.02] mb-16">
        <div class="px-6 py-4 border-b border-white/10">
          <span class="text-xs tracking-widest text-gray-500 uppercase">Our Core Values</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div 
            v-for="value in coreValues" 
            :key="value.title"
            class="p-8 hover:bg-white/[0.03] transition-colors"
          >
            <div class="w-12 h-12 border border-white/10 flex items-center justify-center mb-4">
              <v-icon :icon="value.icon" size="24" class="text-white" />
            </div>
            <h3 class="text-lg font-light text-white mb-2">{{ value.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs tracking-widest text-gray-500 uppercase block mb-1">Leadership</span>
            <h2 class="text-2xl font-light text-white">Meet Our Team</h2>
          </div>
          <router-link 
            to="/contact" 
            class="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            Join Our Team
            <v-icon icon="mdi-arrow-right" size="12" />
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="member in team" 
            :key="member.name"
            class="border border-white/10 bg-white/[0.02] overflow-hidden group hover:border-white/20 transition-all"
          >
            <div class="aspect-[3/4] bg-gray-900 relative overflow-hidden">
              <img 
                :src="member.image" 
                :alt="member.name"
                class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 ring-1 ring-white/10" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h3 class="text-lg font-medium text-white mb-1">{{ member.name }}</h3>
                <p class="text-xs text-gray-400 uppercase tracking-wider">{{ member.role }}</p>
              </div>
            </div>
            <div class="p-6">
              <p class="text-sm text-gray-400 leading-relaxed mb-4">{{ member.bio }}</p>
              <div class="flex gap-3">
                <a 
                  v-for="social in member.socials" 
                  :key="social.icon"
                  :href="social.link"
                  class="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
                >
                  <v-icon :icon="social.icon" size="14" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="border border-white/10 bg-white/[0.02]">
        <div class="px-6 py-4 border-b border-white/10">
          <span class="text-xs tracking-widest text-gray-500 uppercase">Client Testimonials</span>
        </div>
        <div class="p-8 lg:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div 
              v-for="testimonial in testimonials" 
              :key="testimonial.author"
              class="relative"
            >
              <v-icon icon="mdi-format-quote-open" size="48" class="text-white/5 absolute -top-4 -left-4" />
              <p class="text-gray-300 text-lg font-light leading-relaxed mb-6 relative z-10">
                "{{ testimonial.quote }}"
              </p>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-800 overflow-hidden">
                  <img :src="testimonial.avatar" :alt="testimonial.author" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="text-sm font-medium text-white">{{ testimonial.author }}</div>
                  <div class="text-xs text-gray-500">{{ testimonial.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Partners -->
      <div class="mt-16 text-center">
        <span class="text-xs tracking-widest text-gray-500 uppercase mb-8 block">Trusted Partners</span>
        <div class="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
          
          <!-- Mercedes-Benz -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-8 w-auto" viewBox="0 0 120 40" fill="currentColor">
              <path d="M60 0L75 30H45L60 0ZM40 10L55 40H25L40 10ZM80 10L95 40H65L80 10Z" fill="white"/>
              <text x="60" y="35" text-anchor="middle" class="text-[8px] fill-white tracking-widest font-light">MERCEDES-BENZ</text>
            </svg>
          </div>

          <!-- BMW -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="white" stroke-width="1.5"/>
              <path d="M20 20L20 1A19 19 0 0 1 37.5 12.5L20 20Z" fill="white"/>
              <path d="M20 20L37.5 27.5A19 19 0 0 1 20 39L20 20Z" fill="white"/>
              <path d="M20 20L2.5 27.5A19 19 0 0 1 2.5 12.5L20 20Z" fill="white"/>
              <text x="20" y="52" text-anchor="middle" class="text-[6px] fill-white tracking-widest font-light">BMW</text>
            </svg>
          </div>

          <!-- Audi -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-8 w-auto" viewBox="0 0 80 30" fill="none">
              <circle cx="10" cy="15" r="8" stroke="white" stroke-width="1.5"/>
              <circle cx="30" cy="15" r="8" stroke="white" stroke-width="1.5"/>
              <circle cx="50" cy="15" r="8" stroke="white" stroke-width="1.5"/>
              <circle cx="70" cy="15" r="8" stroke="white" stroke-width="1.5"/>
              <text x="40" y="42" text-anchor="middle" class="text-[8px] fill-white tracking-[0.2em] font-light">AUDI</text>
            </svg>
          </div>

          <!-- Porsche -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" stroke="white" stroke-width="1"/>
              <text x="20" y="18" text-anchor="middle" class="text-[10px] fill-white font-serif font-bold tracking-wider">PORSCHE</text>
              <path d="M10 25 Q20 22 30 25" stroke="white" stroke-width="0.5" fill="none"/>
              <text x="20" y="32" text-anchor="middle" class="text-[6px] fill-white tracking-widest">STUTTGART</text>
            </svg>
          </div>

          <!-- Bentley -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 60 40" fill="none">
              <ellipse cx="30" cy="20" rx="28" ry="18" stroke="white" stroke-width="1"/>
              <text x="30" y="24" text-anchor="middle" class="text-[14px] fill-white font-serif font-bold">B</text>
              <path d="M5 20 Q15 10 30 10 Q45 10 55 20" stroke="white" stroke-width="0.5" fill="none"/>
              <path d="M5 20 Q15 30 30 30 Q45 30 55 20" stroke="white" stroke-width="0.5" fill="none"/>
              <text x="30" y="48" text-anchor="middle" class="text-[6px] fill-white tracking-[0.3em] font-light">BENTLEY</text>
            </svg>
          </div>

          <!-- Rolls-Royce -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-8 w-auto" viewBox="0 0 80 30" fill="none">
              <rect x="2" y="8" width="76" height="14" stroke="white" stroke-width="1"/>
              <text x="40" y="18" text-anchor="middle" class="text-[8px] fill-white tracking-[0.15em] font-light">ROLLS-ROYCE</text>
              <text x="40" y="36" text-anchor="middle" class="text-[6px] fill-white tracking-[0.3em] opacity-60">MOTOR CARS</text>
            </svg>
          </div>

          <!-- Lamborghini -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L35 35H5L20 2Z" stroke="white" stroke-width="1" fill="none"/>
              <path d="M12 28 Q20 20 28 28" stroke="white" stroke-width="1" fill="none"/>
              <circle cx="20" cy="22" r="3" fill="white"/>
              <text x="20" y="48" text-anchor="middle" class="text-[6px] fill-white tracking-[0.2em] font-bold">LAMBORGHINI</text>
            </svg>
          </div>

          <!-- Ferrari -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="5" width="30" height="30" fill="none"/>
              <path d="M20 10 Q28 15 28 25 Q28 32 20 32 Q12 32 12 25 Q12 15 20 10" fill="white"/>
              <path d="M20 15 L22 20 L18 20 Z" fill="black"/>
              <text x="20" y="48" text-anchor="middle" class="text-[6px] fill-white tracking-[0.2em] font-bold">FERRARI</text>
            </svg>
          </div>

          <!-- Aston Martin -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-8 w-auto" viewBox="0 0 100 30" fill="none">
              <path d="M10 15 Q25 5 50 15 Q75 5 90 15" stroke="white" stroke-width="1" fill="none"/>
              <path d="M10 15 Q25 25 50 15 Q75 25 90 15" stroke="white" stroke-width="1" fill="none"/>
              <text x="50" y="18" text-anchor="middle" class="text-[7px] fill-white tracking-[0.2em] font-light">ASTON MARTIN</text>
              <line x1="20" y1="15" x2="80" y2="15" stroke="white" stroke-width="0.5"/>
            </svg>
          </div>

          <!-- Lexus -->
          <div class="opacity-50 hover:opacity-100 transition-opacity duration-300">
            <svg class="h-10 w-auto" viewBox="0 0 40 40" fill="none">
              <ellipse cx="20" cy="20" rx="18" ry="12" stroke="white" stroke-width="1"/>
              <text x="20" y="24" text-anchor="middle" class="text-[10px] fill-white font-serif font-bold tracking-wider">L</text>
              <text x="20" y="48" text-anchor="middle" class="text-[6px] fill-white tracking-[0.3em] font-light">LEXUS</text>
            </svg>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import fritzzzz from '../assets/image/fritzzzz.png'
import sandzzzz from '../assets/image/sandzzzz.png'

const coreValues = [
  {
    title: 'Excellence',
    description: 'We pursue perfection in every interaction, from first contact to final delivery.',
    icon: 'mdi-star'
  },
  {
    title: 'Integrity',
    description: 'Transparency and honesty form the foundation of every relationship we build.',
    icon: 'mdi-shield-check'
  },
  {
    title: 'Discretion',
    description: 'We respect your privacy and handle every transaction with complete confidentiality.',
    icon: 'mdi-eye-off'
  },
  {
    title: 'Innovation',
    description: 'Constantly evolving our services to exceed the expectations of modern luxury clients.',
    icon: 'mdi-lightbulb'
  }
]

const team = [
  {
    name: 'John Fritz Izar',
    role: 'Founder & CEO',
    bio: 'Former luxury brand executive with 15 years in automotive excellence. Visionary behind AutoLux\'s client-first philosophy.',
    image: fritzzzz,
    socials: [
      { icon: 'mdi-linkedin', link: '#' },
      { icon: 'mdi-twitter', link: '#' }
    ]
  },
  {
    name: 'Sandra Kate Gudez',
    role: 'Head of Acquisitions',
    bio: 'Expert in rare vehicle sourcing with an unparalleled network across Europe and Asia. Specializes in limited edition models.',
    image: sandzzzz,
    socials: [
      { icon: 'mdi-linkedin', link: '#' },
      { icon: 'mdi-instagram', link: '#' }
    ]
  },
]

const testimonials = [
  {
    quote: 'AutoLux transformed what I expected from a car buying experience. They found my dream vehicle within two weeks and handled every detail flawlessly.',
    author: 'James Richardson',
    title: 'CEO, Richardson Holdings',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
  },
  {
    quote: 'The level of personal attention and expertise is unmatched. They didn\'t just sell me a car—they curated an experience that exceeded all expectations.',
    author: 'Sarah Mitchell',
    title: 'Art Collector & Philanthropist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
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