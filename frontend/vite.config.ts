import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: [{ find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' }],
  },
  build: {
    sourcemap: false,
    target: 'es2015',
    assetsInlineLimit: 0,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Временно
        // drop_console: true,
        dead_code: true,
      },
      toplevel: false,
      keep_classnames: false,
      keep_fnames: false,
      safari10: false,
    },
    rollupOptions: {
      input: 'index-b3.1.html',
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  // Указывать только для dev сборки.
  // Либо index'у вернуть его исходное имя, а переименовывать только при деплое
  base: 'index-b3.1.html',
  server: {
    https: true,
  }
})
