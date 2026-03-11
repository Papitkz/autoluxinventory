import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi, // Font-based icons
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#c9a962',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#09090b',
          surface: '#18181b',
        },
      },
    },
  },
  defaults: {
    global: {
      fontFamily: 'Poppins, sans-serif', // Set Poppins as default
    },
    VApp: {
      style: 'font-family: Poppins, sans-serif;',
    },
  },
})

export default vuetify