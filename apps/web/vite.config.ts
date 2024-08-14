import * as path from 'node:path'
// import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173
  },
  // plugins: [preact()],
  resolve: {
    alias: [
      { find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' },
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      { find: '@types', replacement: path.resolve(__dirname, './src/types') },
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@libs', replacement: path.resolve(__dirname, './src/libs') },
      { find: '@api', replacement: path.resolve(__dirname, './src/api') },
      { find: '@routes', replacement: path.resolve(__dirname, './src/routes') },
      { find: '@views', replacement: path.resolve(__dirname, './src/views') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      }
    ]
  }
  // build: {
  //   sourcemap: false,
  //   target: 'es2017',
  //   assetsInlineLimit: 0,
  // minify: 'terser',
  // terserOptions: {
  //   compress: {
  //     drop_console: true,
  //   },
  //   format: {
  //     comments: false,
  //   },
  // },
  // }
})
