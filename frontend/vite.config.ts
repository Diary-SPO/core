import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: [{ find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' }],
  },
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
      input: 'index-b4.html',
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  // Указывать только для dev сборки.
  // Либо index'у вернуть его исходное имя, а переименовывать только при деплое
  // base: 'index-b4.html',
})
