<template>
  <v-app>
    <Navbar />
    <v-main class="!bg-black min-h-screen pt-16 lg:pt-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <Footer />
    
    <!-- Back to Top Button -->
    <transition name="slide-fade">
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-50 w-12 h-12 lg:w-14 lg:h-14 border border-white/20 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:border-white/40 hover:bg-white hover:text-black transition-all duration-300 group"
        aria-label="Back to top"
      >
        <v-icon 
          icon="mdi-chevron-up" 
          size="24" 
          class="text-white group-hover:text-black transition-colors duration-300" 
        />
      </button>
    </transition>
    
    <!-- Music Player (Bottom Left) -->
    <div class="fixed bottom-8 left-8 z-50 flex flex-col gap-2">
      <!-- Main Player -->
      <transition name="expand">
        <div 
          v-show="isExpanded" 
          class="bg-black/90 backdrop-blur-md border border-white/10 w-72 overflow-hidden"
        >
          <!-- Track Info -->
          <div class="p-4 border-b border-white/10">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                <v-icon icon="mdi-music" size="20" class="text-white/60" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-white font-medium truncate">{{ currentTrack?.title || 'Unknown' }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider truncate">{{ currentTrack?.artist || 'Unknown Artist' }}</p>
              </div>
            </div>
            
            <!-- Progress -->
            <div class="space-y-1">
              <div 
                class="h-1 bg-white/10 cursor-pointer relative group"
                @click="seek"
              >
                <div 
                  class="h-full bg-white transition-all duration-100 relative"
                  :style="{ width: `${progress}%` }"
                >
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div class="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center gap-1">
              <button 
                @click="prevTrack"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <v-icon icon="mdi-skip-previous" size="20" />
              </button>
              
              <button 
                @click="togglePlay"
                class="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <v-icon :icon="isPlaying ? 'mdi-pause' : 'mdi-play'" size="20" />
              </button>
              
              <button 
                @click="nextTrack"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <v-icon icon="mdi-skip-next" size="20" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <!-- Volume -->
              <div class="group relative">
                <button 
                  @click="toggleMute"
                  class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <v-icon :icon="volumeIcon" size="18" />
                </button>
                
                <!-- Volume Slider -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-8 h-24 bg-black border border-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div 
                    class="w-full h-full bg-white/10 relative cursor-pointer"
                    @click="setVolume"
                  >
                    <div 
                      class="absolute bottom-0 left-0 w-full bg-white transition-all"
                      :style="{ height: `${isMuted ? 0 : volume * 100}%` }"
                    />
                  </div>
                </div>
              </div>

              <!-- Playlist Toggle -->
              <button 
                @click="showPlaylist = !showPlaylist"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                :class="{ 'text-white': showPlaylist }"
              >
                <v-icon icon="mdi-playlist-music" size="18" />
              </button>
            </div>
          </div>

          <!-- Playlist -->
          <transition name="slide-down">
            <div v-show="showPlaylist" class="max-h-48 overflow-y-auto border-t border-white/10">
              <div 
                v-for="(track, index) in tracks" 
                :key="track.id || index"
                @click="playTrack(index)"
                class="flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                :class="{ 'bg-white/10': currentTrackIndex === index }"
              >
                <span class="text-[10px] text-gray-500 w-4">{{ index + 1 }}</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-white truncate" :class="{ 'text-emerald-400': currentTrackIndex === index && isPlaying }">{{ track.title }}</p>
                  <p class="text-[10px] text-gray-500 truncate">{{ track.artist }}</p>
                </div>
                <v-icon 
                  v-if="currentTrackIndex === index && isPlaying" 
                  icon="mdi-volume-high" 
                  size="14" 
                  class="text-emerald-400" 
                />
              </div>
            </div>
          </transition>
        </div>
      </transition>

      <!-- Toggle Button (Collapsed State) -->
      <button
        v-show="!isExpanded"
        @click="isExpanded = true"
        class="w-12 h-12 lg:w-14 lg:h-14 border border-white/20 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:border-white/40 hover:bg-white hover:text-black transition-all duration-300 group"
      >
        <v-icon 
          :icon="isPlaying ? 'mdi-music' : 'mdi-music-off'" 
          size="20" 
          :class="isPlaying ? 'text-emerald-400 animate-pulse' : 'text-white group-hover:text-black'" 
        />
      </button>

      <!-- Minimize Button (When Expanded) -->
      <button
        v-show="isExpanded"
        @click="isExpanded = false"
        class="w-10 h-10 border border-white/10 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:border-white/30 transition-all"
      >
        <v-icon icon="mdi-chevron-down" size="18" class="text-gray-400" />
      </button>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioRef"
      :src="currentTrack?.url"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onTrackEnd"
      @error="onError"
    />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

let lenis: any = null
const showBackToTop = ref(false)

// ============================================
// MUSIC PLAYER STATE
// ============================================

interface Track {
  id?: string
  title: string
  artist: string
  url: string
  duration?: number
}

const audioRef = ref<HTMLAudioElement | null>(null)
const tracks = ref<Track[]>([])
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const isExpanded = ref(false)
const showPlaylist = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)

const currentTrack = computed(() => tracks.value[currentTrackIndex.value] || null)

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'mdi-volume-off'
  if (volume.value < 0.3) return 'mdi-volume-low'
  if (volume.value < 0.7) return 'mdi-volume-medium'
  return 'mdi-volume-high'
})

// ============================================
// MUSIC PLAYER METHODS
// ============================================

const scanMusicDirectory = async () => {
  try {
    // Strategy 1: Try to fetch from public/music directory manifest
    try {
      const response = await fetch('/music/tracks.json')
      if (response.ok) {
        const data = await response.json()
        tracks.value = data.tracks.map((t: any) => ({
          ...t,
          url: t.url.startsWith('http') ? t.url : `/music/${t.url}`
        }))
        return
      }
    } catch (e) {
      console.log('No tracks.json found...')
    }

    // Strategy 2: Vite glob import for local files
    const musicFiles = import.meta.glob('/public/music/*.{mp3,wav,ogg,flac}', { eager: true })
    const fileModules = Object.keys(musicFiles)
    
    if (fileModules.length > 0) {
      tracks.value = fileModules.map((path, index) => {
        const filename = path.split('/').pop() || `track-${index}`
        const nameWithoutExt = filename.replace(/\.(mp3|wav|ogg|flac)$/i, '')
        const parts = nameWithoutExt.split(' - ')
        
        return {
          id: `track-${index}`,
          title: parts[1] || nameWithoutExt,
          artist: parts[0] || 'Unknown Artist',
          url: path.replace('/public', '')
        }
      })
      return
    }

    // Fallback: Demo tracks
    tracks.value = [
      {
        id: '1',
        title: 'Drive',
        artist: 'Ed Sheeran',
        url: '../src/public/music/Drive.mp3'
      },
      {
        id: '2',
        title: 'Messy',
        artist: 'Rose',
        url: '../src/public/music/Messy.mp3'
      },
      {
        id: '3',
        title: 'Lose My Mind',
        artist: 'Don Toliver',
        url: '../src/public/music/Lose My Mind.mp3'
      },
      {
        id: '4',
        title: 'Just Keep Watching',
        artist: 'Tate McRae',
        url: '../src/public/music/Just Keep Watching.mp3'
      },
       {
        id: '5',
        title: 'Ferrari',
        artist: 'SF-26',
        url: '../src/public/music/Ferrari.mp3'
      },
      {
        id: '6',
        title: 'I am Rock',
        artist: 'Need for speed Underground',
        url: '../src/public/music/I Am Rock.mp3'
      },
      {
        id: '7',
        title: 'Styles of Beyond',
        artist: 'Need for speed most wanted',
        url: '../src/public/music/Styles of Beyond - Nine Thou - Need for Speed Most Wanted Soundtrack - 1080p.mp3'
      },
       {
        id: '8',
        title: 'Riders on the storm',
        artist: 'Snoop dogg ft The Doors',
        url: '../src/public/music/Riders on the Storm.mp3'
      }
    ]
  } catch (err) {
    console.error('Failed to load music:', err)
  }
}

const togglePlay = () => {
  if (!audioRef.value || !currentTrack.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const playTrack = (index: number) => {
  if (index === currentTrackIndex.value && isPlaying.value) {
    togglePlay()
    return
  }
  
  currentTrackIndex.value = index
  currentTime.value = 0
  
  setTimeout(() => {
    if (audioRef.value) {
      audioRef.value.load()
      audioRef.value.play().then(() => {
        isPlaying.value = true
      }).catch(err => {
        console.error('Playback failed:', err)
        isPlaying.value = false
      })
    }
  }, 50)
}

const nextTrack = () => {
  const next = (currentTrackIndex.value + 1) % tracks.value.length
  playTrack(next)
}

const prevTrack = () => {
  const prev = currentTrackIndex.value === 0 
    ? tracks.value.length - 1 
    : currentTrackIndex.value - 1
  playTrack(prev)
}

const seek = (e: MouseEvent) => {
  if (!audioRef.value || !duration.value) return
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const time = percent * duration.value
  audioRef.value.currentTime = time
  currentTime.value = time
}

const setVolume = (e: MouseEvent) => {
  if (!audioRef.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const percent = 1 - ((e.clientY - rect.top) / rect.height)
  const newVolume = Math.max(0, Math.min(1, percent))
  
  volume.value = newVolume
  isMuted.value = newVolume === 0
  audioRef.value.volume = newVolume
}

const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.volume = isMuted.value ? 0 : volume.value
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const onTrackEnd = () => {
  nextTrack()
}

const onError = () => {
  console.error('Audio error')
  isPlaying.value = false
  setTimeout(nextTrack, 1000)
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleMusicKeydown = (e: KeyboardEvent) => {
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault()
    togglePlay()
  }
  if (e.code === 'ArrowRight' && e.ctrlKey) {
    e.preventDefault()
    nextTrack()
  }
  if (e.code === 'ArrowLeft' && e.ctrlKey) {
    e.preventDefault()
    prevTrack()
  }
}

// ============================================
// BACK TO TOP METHODS (PRESERVED)
// ============================================

const scrollToTop = () => {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  showBackToTop.value = scrollY > 400
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  // Initialize Lenis smooth scroll
  import('@studio-freight/lenis').then((Lenis) => {
    lenis = new Lenis.default({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      wrapper: window,
      content: document.documentElement
    })

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      showBackToTop.value = scroll > 400
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  window.addEventListener('scroll', handleScroll, { passive: true })

  // Initialize music player
  scanMusicDirectory()
  window.addEventListener('keydown', handleMusicKeydown)
  
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }

  authStore.initAuth()
  cartStore.loadFromLocalStorage()
})

onUnmounted(() => {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleMusicKeydown)
  if (audioRef.value) {
    audioRef.value.pause()
  }
})

watch(currentTrack, () => {
  duration.value = 0
  currentTime.value = 0
})
</script>

<style>
/* Import Rubik Font */
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');

/* Global black theme */
html {
  overflow-y: auto;
  background-color: #000;
}

/* Navbar padding adjustment */
.v-main {
  padding-top: 64px !important;
  padding-bottom: 0 !important;
  background-color: #000;
}

/* Black theme only */
.v-application {
  background-color: #000 !important;
}

/* Mobile optimizations */
@media (max-width: 1024px) {
  .v-main {
    padding-top: 64px !important;
  }
}

/* Touch device optimizations */
@media (hover: none) {
  .hover\:scale-105:hover {
    transform: none;
  }
}

/* Prevent horizontal scroll */
body {
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 0;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Selection styling */
::selection {
  background: white;
  color: black;
}
</style>

<style scoped>
/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Back to top button transition */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Music player animations */
.expand-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.expand-enter-from,
.expand-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>