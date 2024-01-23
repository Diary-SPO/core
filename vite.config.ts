import * as path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['vitest-localstorage-mock'],
    mockReset: false
  },
  plugins: [preact()],
  resolve: {
    alias: [
      { find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' },
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      }
    ]
  },
  build: {
    sourcemap: false,
    target: 'es2017',
    assetsInlineLimit: 0,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true
      },
      toplevel: true,
      keep_classnames: false,
      keep_fnames: false,
      safari10: false
    },
    rollupOptions: {
      logLevel: 'debug',
    }
  }
})
