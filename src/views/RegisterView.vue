<!-- RegisterView.vue -->
<template>
  <div class="min-h-screen flex bg-black font-['Poppins'] overflow-hidden">
    
    <!-- Left Side - Ferrari Visual -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden">
      <!-- Ferrari Background Image - Different angle for variety -->
      <div class="absolute inset-0">
        <img 
          src="https://images5.alphacoders.com/714/thumb-1920-714534.jpg" 
          class="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          alt="Ferrari 488 GTB"
        />
        <!-- Dark Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>
      
      <!-- Animated Overlay Elements -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
      
      <!-- Animated Gradient Orbs -->
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div class="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <!-- Animated Lines -->
      <div class="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-line" />
      
      <!-- Floating Geometric Elements -->
      <div class="absolute top-32 right-24 w-28 h-28 border border-white/10 rotate-12 animate-float" />
      <div class="absolute bottom-24 left-20 w-20 h-20 border border-white/10 rotate-45 animate-float delay-700" />

      <div class="relative z-10 flex flex-col justify-center items-start w-full p-12 pl-16">
        
        <!-- Brand with Animation -->
        <div class="mb-16 animate-fade-in-up">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:border-white/60 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <v-icon icon="mdi-car-sports" size="40" class="text-white group-hover:text-red-500 transition-colors duration-500" />
            </div>
            <div>
              <h1 class="text-6xl font-light text-white tracking-tighter mb-1 uppercase animate-slide-up">AutoLux</h1>
              <p class="text-xs text-gray-400 tracking-[0.5em] uppercase animate-slide-up delay-200">Join The Elite</p>
            </div>
          </div>
        </div>

        <!-- Animated Features -->
        <div class="space-y-3 w-full max-w-md">
          <div 
            v-for="(feature, i) in features" 
            :key="i"
            class="flex items-center gap-4 p-4 border-l-2 border-white/20 bg-black/30 backdrop-blur-sm hover:border-red-500 hover:bg-black/50 hover:translate-x-2 transition-all duration-300 group cursor-pointer animate-fade-in-left"
            :style="{ animationDelay: `${400 + i * 150}ms` }"
          >
            <div class="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-red-500 group-hover:scale-110 transition-all duration-300">
              <v-icon :icon="feature.icon" size="20" class="text-gray-300 group-hover:text-red-500 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <span class="text-sm text-gray-300 group-hover:text-white transition-colors font-light tracking-wide">{{ feature.text }}</span>
          </div>
        </div>

        <!-- Animated Stats -->
        <div class="mt-12 flex gap-12 animate-fade-in-up delay-1000">
          <div 
            v-for="(stat, i) in stats" 
            :key="i"
            class="group cursor-pointer"
          >
            <div class="text-4xl font-light text-white mb-1 group-hover:text-red-500 transition-colors duration-300">{{ stat.value }}</div>
            <div class="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto bg-[#0a0a0a]">
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <!-- Animated Background Grid -->
      <div class="absolute inset-0 opacity-[0.03]" 
           style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;">
      </div>

      <div class="w-full max-w-md relative z-10 animate-fade-in-up">
        
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-10 animate-fade-in-down">
          <div class="w-20 h-20 border border-white/20 flex items-center justify-center mx-auto mb-4 bg-white/[0.02] animate-pulse-border">
            <v-icon icon="mdi-car-sports" size="40" class="text-white" />
          </div>
          <h1 class="text-3xl font-light text-white uppercase tracking-tight mb-2">AutoLux</h1>
          <p class="text-xs text-gray-500 tracking-[0.3em] uppercase">Join The Elite</p>
        </div>

        <!-- Form Header -->
        <div class="mb-10 animate-slide-up delay-100">
          <span class="text-[10px] tracking-[0.3em] text-red-500 uppercase block mb-3 font-semibold">Registration</span>
          <h2 class="text-4xl font-light text-white mb-3">Create Account</h2>
          <p class="text-sm text-gray-400">Join our exclusive network of enthusiasts</p>
        </div>

        <!-- Error Alert with Animation -->
        <transition 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div 
            v-if="authStore.error" 
            class="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3 animate-shake"
          >
            <v-icon icon="mdi-alert-circle" size="18" class="shrink-0 mt-0.5" />
            <span>{{ authStore.error }}</span>
            <button @click="authStore.clearError" class="ml-auto text-red-400 hover:text-red-300 hover:rotate-90 transition-all">
              <v-icon icon="mdi-close" size="16" />
            </button>
          </div>
        </transition>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Row -->
          <div class="grid grid-cols-2 gap-4">
            <div class="animate-slide-up delay-200 group">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2 group-focus-within:text-red-500 transition-colors">First Name</label>
              <div class="relative">
                <v-icon icon="mdi-account-outline" size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  v-model="firstName"
                  type="text"
                  required
                  class="w-full bg-transparent border border-white/20 pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:bg-white/[0.02] transition-all hover:border-white/40"
                  placeholder="John"
                />
              </div>
            </div>

            <div class="animate-slide-up delay-200 group">
              <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2 group-focus-within:text-red-500 transition-colors">Last Name</label>
              <div class="relative">
                <v-icon icon="mdi-account-outline" size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  v-model="lastName"
                  type="text"
                  required
                  class="w-full bg-transparent border border-white/20 pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:bg-white/[0.02] transition-all hover:border-white/40"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div class="animate-slide-up delay-300 group">
            <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2 group-focus-within:text-red-500 transition-colors">Email Address</label>
            <div class="relative">
              <v-icon icon="mdi-email-outline" size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                v-model="email"
                type="email"
                required
                class="w-full bg-transparent border border-white/20 pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:bg-white/[0.02] transition-all hover:border-white/40"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div class="animate-slide-up delay-400 group">
            <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2 group-focus-within:text-red-500 transition-colors">Password</label>
            <div class="relative">
              <v-icon icon="mdi-lock-outline" size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full bg-transparent border border-white/20 pl-12 pr-12 py-4 text-sm text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:bg-white/[0.02] transition-all hover:border-white/40"
                placeholder="••••••••"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-all hover:scale-110"
              >
                <v-icon :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" size="16" />
              </button>
            </div>
            <!-- Password Strength Indicator -->
            <div class="mt-3 flex items-center gap-3">
              <div class="flex-1 flex gap-1">
                <div 
                  v-for="n in 4" 
                  :key="n"
                  class="h-1 flex-1 bg-white/10 transition-all duration-500"
                  :class="{ 'bg-red-600': passwordStrength >= n }"
                />
              </div>
              <span class="text-[10px] uppercase tracking-wider" :class="strengthColorClass">
                {{ strengthText }}
              </span>
            </div>
          </div>

          <div class="animate-slide-up delay-500">
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative mt-0.5">
                <input 
                  v-model="agreeTerms"
                  type="checkbox"
                  required
                  class="peer sr-only"
                />
                <div class="w-5 h-5 border border-white/20 peer-checked:bg-red-600 peer-checked:border-red-600 transition-all duration-300 group-hover:border-white/40" />
                <v-icon 
                  icon="mdi-check" 
                  size="12" 
                  class="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                />
              </div>
              <span class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                I agree to the <router-link to="/terms" class="text-white hover:text-red-500 transition-colors">Terms of Service</router-link> and <router-link to="/privacy" class="text-white hover:text-red-500 transition-colors">Privacy Policy</router-link>
              </span>
            </label>
          </div>

          <button 
            type="submit"
            :disabled="authStore.loading || !agreeTerms"
            class="w-full py-4 bg-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group animate-slide-up delay-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            <v-icon v-if="!authStore.loading" icon="mdi-account-plus" size="16" class="group-hover:translate-x-1 transition-transform" />
            <span v-if="authStore.loading" class="flex items-center gap-2">
              <span class="w-4 h-4 border border-white/20 border-t-white animate-spin rounded-full" />
              Creating...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Divider with Animation -->
        <div class="flex items-center gap-4 my-8 animate-fade-in delay-700">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span class="text-[10px] text-gray-500 uppercase tracking-wider">Or continue with</span>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <!-- Google Login with Hover Effect -->
        <button 
          @click="handleGoogleRegister"
          :disabled="authStore.loading"
          class="w-full py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group animate-slide-up delay-800"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" class="group-hover:scale-110 transition-transform">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="group-hover:translate-x-1 transition-transform">Google</span>
        </button>

        <!-- Login Link -->
        <div class="mt-10 pt-8 border-t border-white/10 text-center animate-fade-in delay-900">
          <span class="text-sm text-gray-500">Already have an account?</span>
          <router-link 
            to="/login" 
            class="text-sm text-white font-medium ml-2 hover:text-red-500 transition-colors relative inline-block group"
          >
            Sign In
            <span class="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
          </router-link>
        </div>

        <!-- Trust Badges with Stagger -->
        <div class="mt-10 flex justify-center gap-3 animate-fade-in-up delay-1000">
          <div 
            v-for="(badge, i) in trustBadges" 
            :key="badge.text"
            class="flex items-center gap-2 px-4 py-3 border border-white/5 bg-white/[0.02] hover:border-red-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group animate-fade-in"
            :style="{ animationDelay: `${1000 + i * 100}ms` }"
          >
            <v-icon :icon="badge.icon" size="14" :class="badge.color" class="group-hover:scale-110 transition-transform" />
            <span class="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">{{ badge.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const agreeTerms = ref(false)

const features = [
  { icon: 'mdi-car-search', text: 'Browse 500+ Premium Vehicles' },
  { icon: 'mdi-calculator', text: 'Instant Financing Calculator' },
  { icon: 'mdi-handshake', text: 'Trusted Dealer Network' },
  { icon: 'mdi-shield-check', text: 'Secure Transactions' }
]

const stats = [
  { value: '50K+', label: 'Members' },
  { value: '500+', label: 'Vehicles' },
  { value: '24/7', label: 'Support' }
]

const trustBadges = [
  { icon: 'mdi-lock-check', text: 'Secure', color: 'text-emerald-400' },
  { icon: 'mdi-shield', text: 'Protected', color: 'text-blue-400' },
  { icon: 'mdi-check-decagram', text: 'Verified', color: 'text-amber-400' }
]

// Password strength calculation
const passwordStrength = computed(() => {
  const pwd = password.value
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++
  return strength
})

const strengthColorClass = computed(() => {
  const classes = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-red-500']
  return password.value ? classes[passwordStrength.value - 1] || 'text-red-400' : 'text-gray-600'
})

const strengthText = computed(() => {
  const texts = ['Weak', 'Fair', 'Good', 'Strong']
  return password.value ? texts[passwordStrength.value - 1] || 'Weak' : 'Strength'
})

// In RegisterView.vue script, update handleRegister:
const handleRegister = async () => {
  const displayName = `${firstName.value} ${lastName.value}`
  const success = await authStore.register(email.value, password.value, displayName)
  if (success) {
    router.push('/verify-email') // Redirect to verification instead of home
  }
}

const handleGoogleRegister = async () => {
  const success = await authStore.loginWithGoogle()
  if (success) {
    router.push('/')
  }
}

onMounted(() => {
  document.body.classList.add('overflow-hidden')
})
</script>

<style scoped>
* {
  border-radius: 0 !important;
}

:deep(.v-icon) {
  border-radius: 0 !important;
}

::selection {
  background: #dc2626;
  color: white;
}

/* Custom Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.05;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.1);
  }
}

@keyframes pulse-border {
  0%, 100% {
    border-color: rgba(255, 255, 255, 0.2);
  }
  50% {
    border-color: rgba(220, 38, 38, 0.5);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(45deg);
  }
  50% {
    transform: translateY(-20px) rotate(50deg);
  }
}

@keyframes line {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes slow-zoom {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-line {
  animation: line 20s linear infinite;
  background-size: 100% 200%;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-slow-zoom {
  animation: slow-zoom 20s ease-in-out infinite;
}

/* Delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }
.delay-800 { animation-delay: 800ms; }
.delay-900 { animation-delay: 900ms; }
.delay-1000 { animation-delay: 1000ms; }

/* Input autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Scrollbar for form side */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>