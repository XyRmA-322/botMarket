import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path' // Добавляем import для resolve

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true // Automatically imports all components & directives
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url))
    }
  },
  server: {
    proxy: {
      // Для локальной разработки с API
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
})

// "scripts": {
//   "dev": "kill-port --port 5173,3000 && vite",
//   "dev:api": "kill-port --port 3000 && nodemon --watch 'api/**/*.ts' --watch 'server.js' -e js,ts --exec node server.js",
//   "dev:all": "npm-run-all --parallel dev dev:api",
//   "build": "vite build",
//   "preview": "vite preview",
//   "vercel-build": "vite build",
//   "start": "node server.js"
// },
