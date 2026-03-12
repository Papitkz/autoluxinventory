    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    import vuetify from 'vite-plugin-vuetify' // Add this
    import { fileURLToPath, URL } from 'node:url'

    export default defineConfig({
      plugins: [
        vue(),
        vuetify({ autoImport: true }), // Add this line
      ],
      optimizeDeps: {
        include: ['swiper']
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
      server: {
        port: 3000,
        open: true
      },
      build: {
        outDir: 'dist',
        sourcemap: true
      },  
    })