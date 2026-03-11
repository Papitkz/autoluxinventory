import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 1. Font CSS first
import '@mdi/font/css/materialdesignicons.css'

// 2. Vuetify styles
import 'vuetify/styles'

// 3. Your custom styles (after vuetify so they can override)
import './assets/main.css'


// Swiper CSS
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

// 4. Vuetify plugin (after styles)
import vuetify from './plugins/vuetify'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')