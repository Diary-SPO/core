/**
 * В проекте мы используем rsbuild, но для тестов vitest
 * И чтобы поддержать работу vitest мы не можем удалить этот конфиг
 *
 * NOTE: на саму сборку это никак не влияет и пользователь не получает лишние килобайты
 **/

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
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      }
    ]
  }
})
