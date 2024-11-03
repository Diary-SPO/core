import path from 'node:path'
import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl'
import { pluginReact } from '@rsbuild/plugin-react'

const { publicVars } = loadEnv({ prefixes: ['VITE_'] })

export default defineConfig({
  plugins: [pluginReact(), pluginBasicSsl()],
  output: {
    // polyfill: 'usage',
    minify: true
  },
  server: {
    port: 5173
    // base: './'
  },
  html: {
    template: './index.html'
  },
  source: {
    define: publicVars,
    alias: {
      '@vkontakte/vkui$': '@vkontakte/vkui/dist/cssm',
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@libs': path.resolve(__dirname, './src/libs'),
      '@api': path.resolve(__dirname, './src/api'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@views': path.resolve(__dirname, './src/views'),
      '@components': path.resolve(__dirname, './src/components')
    },
    entry: {
      index: './src/main.tsx'
    }
  }
})
