<template>
  <div class="bg-black min-h-screen text-white font-['Poppins'] selection:bg-white selection:text-black pb-20">
    
    <!-- Header -->
    <header class="border-b border-white/10 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span class="text-xs tracking-[0.3em] text-gray-500 uppercase block mb-2">Get in Touch</span>
            <h1 class="text-4xl lg:text-6xl font-light tracking-tight">
              CONTACT <span class="text-gray-500">US</span>
            </h1>
            <p class="text-gray-400 text-sm mt-3 font-light max-w-lg">
              Ready to begin your journey? Reach out and our team will respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Contact Info Sidebar -->
        <aside class="w-full lg:w-96 shrink-0 space-y-6">
          
          <!-- Quick Contact -->
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Direct Contact</span>
            </div>
            <div class="divide-y divide-white/5">
              <a 
                v-for="contact in directContacts" 
                :key="contact.label"
                :href="contact.href"
                class="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.03] transition-colors group"
              >
                <div class="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  <v-icon :icon="contact.icon" size="18" :class="contact.iconColor" />
                </div>
                <div>
                  <div class="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{{ contact.label }}</div>
                  <div class="text-sm text-white">{{ contact.value }}</div>
                </div>
              </a>
            </div>
          </div>

          <!-- Visit Us -->
          <div class="border border-white/10 bg-white/[0.02] p-6">
            <span class="text-xs tracking-widest text-gray-500 uppercase block mb-4">Visit Our Showroom</span>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
                  <v-icon icon="mdi-map-marker" size="18" class="text-red-400" />
                </div>
                <div>
                  <p class="text-sm text-white mb-1">AutoLux Headquarters</p>
                  <p class="text-xs text-gray-500 leading-relaxed">
                    1000 Beverly Hills Boulevard<br />
                    Beverly Hills, CA 90210<br />
                    United States
                  </p>
                </div>
              </div>
              <div class="aspect-video bg-gray-900 relative overflow-hidden border border-white/10">
                <img 
                  src="https://static0.topspeedimages.com/wordpress/wp-content/uploads/2024/10/2025-chevrolet-corvette-stingray.jpg?q=49&fit=contain&w=750&h=422&dpr=2" 
                  alt="Showroom Location"
                  class="w-full h-full object-cover opacity-60"
                />
                <div class="absolute inset-0 flex items-center justify-center">
                  <button class="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all">
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hours -->
          <div class="border border-white/10 bg-white/[0.02] p-6">
            <span class="text-xs tracking-widest text-gray-500 uppercase block mb-4">Business Hours</span>
            <div class="space-y-2">
              <div v-for="hours in businessHours" :key="hours.day" class="flex justify-between text-sm">
                <span class="text-gray-500">{{ hours.day }}</span>
                <span :class="hours.hours === 'Closed' ? 'text-red-400' : 'text-white'">{{ hours.hours }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Contact Form -->
        <div class="flex-1">
          <div class="border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Send a Message</span>
            </div>
            <form @submit.prevent="submitForm" class="p-6 lg:p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">First Name *</label>
                  <input 
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Last Name *</label>
                  <input 
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Email Address *</label>
                  <input 
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Phone Number</label>
                  <input 
                    v-model="form.phone"
                    type="tel"
                    class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Subject *</label>
                <select 
                  v-model="form.subject"
                  required
                  class="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                >
                  <option value="" disabled class="bg-black">Select a subject</option>
                  <option v-for="subject in subjects" :key="subject" :value="subject" class="bg-black">
                    {{ subject }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Message *</label>
                <textarea 
                  v-model="form.message"
                  rows="5"
                  required
                  class="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div class="flex items-start gap-3">
                <input 
                  v-model="form.newsletter"
                  type="checkbox"
                  id="newsletter"
                  class="mt-1 w-4 h-4 border border-white/20 bg-transparent rounded-none focus:ring-0 focus:border-white"
                />
                <label for="newsletter" class="text-xs text-gray-500 leading-relaxed cursor-pointer">
                  Subscribe to our newsletter for exclusive inventory updates and luxury automotive insights.
                </label>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <p class="text-xs text-gray-500">
                  <span class="text-white">*</span> Required fields
                </p>
                <button 
                  type="submit"
                  :disabled="submitting"
                  class="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <v-icon v-if="!submitting" icon="mdi-send" size="16" />
                  <span v-if="submitting">Sending...</span>
                  <span v-else>Send Message</span>
                </button>
              </div>
            </form>
          </div>

          <!-- FAQ Preview -->
          <div class="mt-8 border border-white/10 bg-white/[0.02]">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <span class="text-xs tracking-widest text-gray-500 uppercase">Frequently Asked Questions</span>
              <router-link to="/faq" class="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                View All
              </router-link>
            </div>
            <div class="divide-y divide-white/5">
              <div 
                v-for="faq in faqs" 
                :key="faq.question"
                class="px-6 py-4"
              >
                <h4 class="text-sm text-white mb-2">{{ faq.question }}</h4>
                <p class="text-xs text-gray-500 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Connect -->
      <div class="mt-12 text-center">
        <span class="text-xs tracking-widest text-gray-500 uppercase mb-6 block">Connect With Us</span>
        <div class="flex justify-center gap-4">
          <a 
            v-for="social in socials" 
            :key="social.name"
            :href="social.link"
            class="w-12 h-12 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
          >
            <v-icon :icon="social.icon" size="20" />
          </a>
        </div>
      </div>
    </main>

    <!-- Success Toast -->
    <div 
      v-if="showSuccess"
      class="fixed bottom-6 right-6 z-50 px-6 py-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 transition-all duration-300"
    >
      <v-icon icon="mdi-check-circle" size="20" />
      <span class="text-sm">Message sent successfully!</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

const submitting = ref(false)
const showSuccess = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  newsletter: false
})

const directContacts = [
  {
    label: 'Sales Inquiries',
    value: 'sales@autolux.com',
    href: 'mailto:sales@autolux.com',
    icon: 'mdi-email',
    iconColor: 'text-blue-400'
  },
  {
    label: 'Phone',
    value: '+1 (310) 555-0199',
    href: 'tel:+13105550199',
    icon: 'mdi-phone',
    iconColor: 'text-emerald-400'
  },
  {
    label: 'WhatsApp',
    value: '+1 (310) 555-0199',
    href: 'https://wa.me/13105550199',
    icon: 'mdi-whatsapp',
    iconColor: 'text-green-400'
  }
]

const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
]

const subjects = [
  'Vehicle Inquiry',
  'Trade-In Evaluation',
  'Financing Options',
  'Service Appointment',
  'General Question',
  'Partnership Opportunity'
]

const faqs = [
  {
    question: 'How long does the sourcing process take?',
    answer: 'Typically 2-4 weeks depending on rarity and location. We provide weekly updates throughout the process.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we coordinate worldwide delivery with full insurance and customs handling.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept wire transfer, certified checks, and arranged financing through our premium partners.'
  }
]

const socials = [
  { name: 'Instagram', icon: 'mdi-instagram', link: '#' },
  { name: 'Facebook', icon: 'mdi-facebook', link: '#' },
  { name: 'Twitter', icon: 'mdi-twitter', link: '#' },
  { name: 'LinkedIn', icon: 'mdi-linkedin', link: '#' },
  { name: 'YouTube', icon: 'mdi-youtube', link: '#' }
]

const submitForm = async () => {
  submitting.value = true
  
  try {
    // Save to Firestore
    await addDoc(collection(db, 'contacts'), {
      ...form.value,
      createdAt: serverTimestamp(),
      status: 'new'
    })
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false
    }
    
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    submitting.value = false
  }
}
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

/* Custom checkbox */
input[type="checkbox"] {
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1em;
  height: 1em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em white;
  transform-origin: center;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

/* Input autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>