<!-- ForgotPasswordView.vue -->
<template>
  <div class="min-h-screen flex bg-black font-['Poppins'] overflow-hidden">
    
    <!-- Left Side - Ferrari Visual -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden">
      <!-- Ferrari Background Image -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1503376763036-066120622c74?w=1920&q=80" 
          class="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          alt="Ferrari Interior"
        />
        <!-- Dark Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>
      
      <!-- Animated Overlay Elements -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
      
      <!-- Animated Gradient Orbs -->
      <div class="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <!-- Animated Lines -->
      <div class="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-line" />
      
      <!-- Floating Geometric Elements -->
      <div class="absolute top-24 right-32 w-32 h-32 border border-white/10 rotate-12 animate-float" />
      <div class="absolute bottom-32 left-24 w-24 h-24 border border-white/10 rotate-45 animate-float delay-700" />

      <div class="relative z-10 flex flex-col justify-center items-start w-full p-12 pl-16">
        
        <!-- Brand with Animation -->
        <div class="mb-16 animate-fade-in-up">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:border-white/60 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <v-icon icon="mdi-car-sports" size="40" class="text-white group-hover:text-red-500 transition-colors duration-500" />
            </div>
            <div>
              <h1 class="text-6xl font-light text-white tracking-tighter mb-1 uppercase animate-slide-up">AutoLux</h1>
              <p class="text-xs text-gray-400 tracking-[0.5em] uppercase animate-slide-up delay-200">Account Recovery</p>
            </div>
          </div>
        </div>

        <!-- Recovery Info -->
        <div class="space-y-3 w-full max-w-md">
          <div 
            v-for="(step, i) in recoverySteps" 
            :key="i"
            class="flex items-center gap-4 p-4 border-l-2 border-white/20 bg-black/30 backdrop-blur-sm hover:border-red-500 hover:bg-black/50 hover:translate-x-2 transition-all duration-300 group cursor-pointer animate-fade-in-left"
            :style="{ animationDelay: `${400 + i * 150}ms` }"
          >
            <div class="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-red-500 group-hover:scale-110 transition-all duration-300">
              <v-icon :icon="step.icon" size="20" class="text-gray-300 group-hover:text-red-500 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <span class="text-sm text-gray-300 group-hover:text-white transition-colors font-light tracking-wide">{{ step.text }}</span>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="mt-12 animate-fade-in-up delay-1000">
          <p class="text-xs text-gray-500 uppercase tracking-widest mb-4">Need Assistance?</p>
          <div class="flex gap-6">
            <a href="#" class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
              <v-icon icon="mdi-headset" size="18" class="group-hover:text-red-500 transition-colors" />
              <span class="text-sm">24/7 Support</span>
            </a>
            <a href="#" class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
              <v-icon icon="mdi-chat" size="18" class="group-hover:text-red-500 transition-colors" />
              <span class="text-sm">Live Chat</span>
            </a>
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
          <p class="text-xs text-gray-500 tracking-[0.3em] uppercase">Account Recovery</p>
        </div>

        <!-- Success State -->
        <transition 
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="emailSent" class="text-center py-12 animate-fade-in-up">
            <div class="w-24 h-24 border-2 border-red-600/30 bg-red-600/10 flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
              <v-icon icon="mdi-email-check" size="48" class="text-red-500" />
            </div>
            <h2 class="text-3xl font-light text-white mb-4">Check Your Email</h2>
            <p class="text-gray-400 mb-8 leading-relaxed">
              We've sent password reset instructions to<br>
              <span class="text-white font-medium">{{ email }}</span>
            </p>
            <div class="space-y-4">
              <button 
                @click="resetForm"
                class="w-full py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/40 transition-all"
              >
                Send to Different Email
              </button>
              <router-link 
                to="/login" 
                class="block w-full py-4 bg-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-all"
              >
                Return to Login
              </router-link>
            </div>
            <p class="mt-8 text-xs text-gray-600">
              Didn't receive the email? Check your spam folder or 
              <button @click="handleSubmit" class="text-red-500 hover:text-red-400 transition-colors underline">resend</button>
            </p>
          </div>
        </transition>

        <!-- Form State -->
        <transition 
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="!emailSent">
            <!-- Form Header -->
            <div class="mb-10 animate-slide-up delay-100">
              <span class="text-[10px] tracking-[0.3em] text-red-500 uppercase block mb-3 font-semibold">Password Recovery</span>
              <h2 class="text-4xl font-light text-white mb-3">Forgot Password?</h2>
              <p class="text-sm text-gray-400">Enter your email address and we'll send you instructions to reset your password.</p>
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
                v-if="error" 
                class="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3 animate-shake"
              >
                <v-icon icon="mdi-alert-circle" size="18" class="shrink-0 mt-0.5" />
                <span>{{ error }}</span>
                <button @click="error = ''" class="ml-auto text-red-400 hover:text-red-300 hover:rotate-90 transition-all">
                  <v-icon icon="mdi-close" size="16" />
                </button>
              </div>
            </transition>

            <!-- Forgot Password Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="animate-slide-up delay-200 group">
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2 group-focus-within:text-red-500 transition-colors">Email Address</label>
                <div class="relative">
                  <v-icon icon="mdi-email-outline" size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    v-model="email"
                    type="email"
                    required
                    :disabled="loading"
                    class="w-full bg-transparent border border-white/20 pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:bg-white/[0.02] transition-all hover:border-white/40 disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button 
                type="submit"
                :disabled="loading || !email"
                class="w-full py-4 bg-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group animate-slide-up delay-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              >
                <v-icon v-if="!loading" icon="mdi-send" size="16" class="group-hover:translate-x-1 transition-transform" />
                <span v-if="loading" class="flex items-center gap-2">
                  <span class="w-4 h-4 border border-white/20 border-t-white animate-spin rounded-full" />
                  Sending...
                </span>
                <span v-else>Send Reset Link</span>
              </button>
            </form>

            <!-- Divider with Animation -->
            <div class="flex items-center gap-4 my-8 animate-fade-in delay-400">
              <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span class="text-[10px] text-gray-500 uppercase tracking-wider">Or</span>
              <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <!-- Back to Login -->
            <div class="animate-slide-up delay-500">
              <router-link 
                to="/login" 
                class="w-full py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-3 group"
              >
                <v-icon icon="mdi-arrow-left" size="16" class="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Login</span>
              </router-link>
            </div>

            <!-- Security Note -->
            <div class="mt-8 p-4 border border-white/5 bg-white/[0.02] animate-fade-in delay-600">
              <div class="flex items-start gap-3">
                <v-icon icon="mdi-shield-lock" size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs text-gray-400 leading-relaxed">
                    For security reasons, password reset links expire after 24 hours. If you don't see the email within a few minutes, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Trust Badges -->
        <div class="mt-10 flex justify-center gap-3 animate-fade-in-up delay-700">
          <div 
            v-for="(badge, i) in trustBadges" 
            :key="badge.text"
            class="flex items-center gap-2 px-4 py-3 border border-white/5 bg-white/[0.02] hover:border-red-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group animate-fade-in"
            :style="{ animationDelay: `${700 + i * 100}ms` }"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)
const error = ref('')

const recoverySteps = [
  { icon: 'mdi-email-search', text: 'Enter your registered email address' },
  { icon: 'mdi-link-variant', text: 'Click the secure reset link we send' },
  { icon: 'mdi-lock-reset', text: 'Create your new secure password' }
]

const trustBadges = [
  { icon: 'mdi-lock-check', text: 'Secure', color: 'text-emerald-400' },
  { icon: 'mdi-shield', text: 'Protected', color: 'text-blue-400' },
  { icon: 'mdi-check-decagram', text: 'Verified', color: 'text-amber-400' }
]

const handleSubmit = async () => {
  if (!email.value) return
  
  loading.value = true
  error.value = ''
  
  // Use auth store instead of simulated API
  const success = await authStore.forgotPassword(email.value)
  
  if (success) {
    emailSent.value = true
  } else {
    error.value = authStore.error || 'Failed to send reset email. Please try again.'
  }
  
  loading.value = false
}

const resetForm = () => {
  emailSent.value = false
  email.value = ''
  error.value = ''
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
    transform: translateY(0) rotate(12deg);
  }
  50% {
    transform: translateY(-20px) rotate(17deg);
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