import * as path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: [
      { find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' },
      {
        find: '@helpers',
        replacement: path.resolve(__dirname, './src/helpers')
      },
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@libs', replacement: path.resolve(__dirname, './src/libs') },
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
    rollupOptions: {
      logLevel: 'debug',
      output: {
        generatedCode: {
          preset: 'es2015',
          arrowFunctions: false
        }
      }
    }
  }
})
