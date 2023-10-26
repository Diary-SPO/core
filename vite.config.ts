import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: [{ find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' }],
  },
  base: '/frontend/',
  build: {
    sourcemap: false,
    target: 'es2017',
    assetsInlineLimit: 0,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true,
      },
      toplevel: true,
      keep_classnames: false,
      keep_fnames: false,
      safari10: false,
    },
    rollupOptions: {
      logLevel: 'debug',
      // input: 'frontend',
      output: {
        manualChunks: {
          '@reduxjs/toolkit': ['@reduxjs/toolkit'],
          'react-redux': ['react-redux'],
          '@vkontakte/icons': ['@vkontakte/icons'],
        },
      },
    },
  },
})
