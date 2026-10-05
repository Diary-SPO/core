import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    minify: true,
    distPath: { root: 'dist' }
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
