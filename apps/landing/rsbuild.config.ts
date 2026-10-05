import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    minify: true,
    distPath: { root: 'dist' },
    // Относительные пути, чтобы dist работал из любой подпапки
    // (корень сайта и /pre/ для canary).
    assetPrefix: './'
  },
  html: {
    template: './index.html'
  },
  source: {
    entry: {
      index: './src/main.tsx'
    }
  }
})
