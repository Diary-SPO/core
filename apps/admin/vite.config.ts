import { URL, fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5174
  },
  plugins: [vue(), vueJsx()],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
