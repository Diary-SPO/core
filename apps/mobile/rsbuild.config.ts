import path from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

const webRoot = path.resolve(__dirname, '../web')

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: './',
    distPath: { root: 'dist' },
    minify: true
  },
  html: {
    template: path.resolve(webRoot, 'index.html')
  },
  source: {
    entry: {
      index: path.resolve(webRoot, 'src/main.tsx')
    },
    alias: {
      '@runtime-api': path.resolve(__dirname, './src/runtime-api.ts'),
      '@store': path.resolve(webRoot, './src/store'),
      '@vkontakte/vkui$': '@vkontakte/vkui/dist/cssm'
    },
    define: {
      'import.meta.env.VITE_MODE': JSON.stringify('prod'),
      'import.meta.env.VITE_DIARY_SOURCE': JSON.stringify('direct'),
      'import.meta.env.VITE_DIARY_URL': JSON.stringify(
        process.env.VITE_DIARY_URL ?? 'https://poo.tomedu.ru'
      ),
      'import.meta.env.VITE_SERVER_URL': JSON.stringify(''),
      'import.meta.env.VITE_ADMIN_PAGE_URL': JSON.stringify(''),
      'import.meta.env.VITE_BETA_VERSION': JSON.stringify('false')
    }
  }
})
