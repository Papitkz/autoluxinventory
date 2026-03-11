<!-- VerifyEmailView.vue -->
<template>
  <div class="min-h-screen flex bg-black font-['Poppins'] overflow-hidden">
    
    <!-- Left Side - Ferrari Visual -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80" 
          class="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          alt="Ferrari Engine"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>
      
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      <div class="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-line" />
      <div class="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45 animate-float" />
      <div class="absolute bottom-32 left-16 w-24 h-24 border border-white/10 rotate-12 animate-float delay-700" />

      <div class="relative z-10 flex flex-col justify-center items-start w-full p-12 pl-16">
        <div class="mb-16 animate-fade-in-up">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <v-icon icon="mdi-car-sports" size="40" class="text-white" />
            </div>
            <div>
              <h1 class="text-6xl font-light text-white tracking-tighter mb-1 uppercase animate-slide-up">AutoLux</h1>
              <p class="text-xs text-gray-400 tracking-[0.5em] uppercase animate-slide-up delay-200">Secure Access</p>
            </div>
          </div>
        </div>

        <div class="space-y-3 w-full max-w-md">
          <div 
            v-for="(step, i) in securitySteps" 
            :key="i"
            class="flex items-center gap-4 p-4 border-l-2 border-white/20 bg-black/30 backdrop-blur-sm"
            :class="{ 'border-red-500 bg-red-500/10': currentStep > i }"
            :style="{ animationDelay: `${400 + i * 150}ms` }"
          >
            <div class="w-10 h-10 border border-white/20 flex items-center justify-center" :class="{ 'border-red-500': currentStep > i }">
              <v-icon :icon="step.icon" size="20" :class="currentStep > i ? 'text-red-500' : 'text-gray-300'" />
            </div>
            <span class="text-sm text-gray-300 font-light tracking-wide">{{ step.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto bg-[#0a0a0a]">
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div class="absolute inset-0 opacity-[0.03]" 
           style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;">
      </div>

      <div class="w-full max-w-md relative z-10">
        
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-10 animate-fade-in-down">
          <div class="w-20 h-20 border border-white/20 flex items-center justify-center mx-auto mb-4 bg-white/[0.02] animate-pulse-border">
            <v-icon icon="mdi-car-sports" size="40" class="text-white" />
          </div>
          <h1 class="text-3xl font-light text-white uppercase tracking-tight mb-2">AutoLux</h1>
          <p class="text-xs text-gray-500 tracking-[0.3em] uppercase">Secure Access</p>
        </div>

        <!-- Verified Success State -->
        <transition 
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="verified" class="text-center py-12 animate-fade-in-up">
            <div class="w-24 h-24 border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
              <v-icon icon="mdi-check-circle" size="48" class="text-emerald-500" />
            </div>
            <h2 class="text-3xl font-light text-white mb-4">Email Verified!</h2>
            <p class="text-gray-400 mb-8">Your account is now active. Redirecting to dashboard...</p>
            <router-link 
              to="/" 
              class="w-full py-4 bg-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-all inline-block"
            >
              Continue to Dashboard
            </router-link>
          </div>
        </transition>

        <!-- Verification Pending State -->
        <div v-if="!verified" class="animate-fade-in-up">
          <div class="mb-10 text-center animate-slide-up delay-100">
            <span class="text-[10px] tracking-[0.3em] text-red-500 uppercase block mb-3 font-semibold">Verification Required</span>
            <h2 class="text-4xl font-light text-white mb-3">Check Your Email</h2>
            <p class="text-sm text-gray-400">
              We've sent a verification link to<br>
              <span class="text-white font-medium">{{ authStore.user?.email }}</span>
            </p>
          </div>

          <!-- Email Icon Animation -->
          <div class="flex justify-center mb-10 animate-fade-in delay-200">
            <div class="relative">
              <div class="w-32 h-32 border border-white/20 flex items-center justify-center bg-white/[0.02] animate-pulse-border">
                <v-icon icon="mdi-email-send" size="48" class="text-red-500" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 flex items-center justify-center animate-pulse">
                <span class="text-white text-xs font-bold">1</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4 animate-slide-up delay-300">
            <button 
              @click="checkVerification"
              :disabled="checking"
              class="w-full py-4 bg-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
            >
              <span v-if="checking" class="flex items-center gap-2">
                <span class="w-4 h-4 border border-white/20 border-t-white animate-spin rounded-full" />
                Checking...
              </span>
              <span v-else class="flex items-center gap-2">
                <v-icon icon="mdi-refresh" size="16" :class="{ 'animate-spin': checking }" />
                I've Verified My Email
              </span>
            </button>

            <button 
              @click="resendEmail"
              :disabled="resendLoading || countdown > 0"
              class="w-full py-4 border border-white/20 text-white text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              <v-icon icon="mdi-email-sync" size="16" class="group-hover:rotate-180 transition-transform duration-500" />
              <span v-if="countdown > 0">Resend in {{ countdown }}s</span>
              <span v-else>Resend Email</span>
            </button>
          </div>

          <!-- Tips -->
          <div class="mt-8 space-y-3 animate-fade-in delay-400">
            <div class="flex items-start gap-3 p-3 border border-white/5 bg-white/[0.02]">
              <v-icon icon="mdi-information" size="16" class="text-blue-400 shrink-0 mt-0.5" />
              <p class="text-xs text-gray-400">Check your spam/junk folder if you don't see the email within a few minutes.</p>
            </div>
            <div class="flex items-start gap-3 p-3 border border-white/5 bg-white/[0.02]">
              <v-icon icon="mdi-clock" size="16" class="text-amber-400 shrink-0 mt-0.5" />
              <p class="text-xs text-gray-400">Verification links expire after 24 hours for security reasons.</p>
            </div>
          </div>

          <!-- Logout Option -->
          <div class="mt-8 text-center animate-fade-in delay-500">
            <button 
              @click="logout" 
              class="text-xs text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider"
            >
              Use Different Account
            </button>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="mt-10 flex justify-center gap-3 animate-fade-in-up delay-600">
          <div 
            v-for="(badge, i) in trustBadges" 
            :key="badge.text"
            class="flex items-center gap-2 px-4 py-3 border border-white/5 bg-white/[0.02] hover:border-red-500/30 transition-all cursor-pointer group"
            :style="{ animationDelay: `${600 + i * 100}ms` }"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const verified = ref(false)
const checking = ref(false)
const resendLoading = ref(false)
const countdown = ref(0)
let countdownInterval = null

const currentStep = ref(1)

const securitySteps = [
  { icon: 'mdi-account-check', text: 'Account Created' },
  { icon: 'mdi-email-seal', text: 'Email Verification' },
  { icon: 'mdi-shield-check', text: 'Secure Access Granted' }
]

const trustBadges = [
  { icon: 'mdi-lock-check', text: 'Secure', color: 'text-emerald-400' },
  { icon: 'mdi-shield', text: 'Protected', color: 'text-blue-400' },
  { icon: 'mdi-check-decagram', text: 'Verified', color: 'text-amber-400' }
]

const checkVerification = async () => {
  checking.value = true
  const isVerified = await authStore.checkEmailVerified()
  
  if (isVerified) {
    verified.value = true
    currentStep.value = 3
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    authStore.error = 'Email not verified yet. Please check your inbox and click the verification link.'
  }
  checking.value = false
}

const resendEmail = async () => {
  resendLoading.value = true
  const success = await authStore.resendVerificationEmail()
  resendLoading.value = false
  
  if (success) {
    countdown.value = 60
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Check if already verified
  if (authStore.isEmailVerified) {
    verified.value = true
    currentStep.value = 3
    setTimeout(() => router.push('/'), 1500)
  }
  
  document.body.classList.add('overflow-hidden')
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  document.body.classList.remove('overflow-hidden')
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

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.05; transform: scale(1); }
  50% { opacity: 0.1; transform: scale(1.1); }
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(255, 255, 255, 0.2); }
  50% { border-color: rgba(220, 38, 38, 0.5); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(45deg); }
  50% { transform: translateY(-20px) rotate(50deg); }
}

@keyframes line {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}

@keyframes slow-zoom {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
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

.animate-slow-zoom {
  animation: slow-zoom 20s ease-in-out infinite;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

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