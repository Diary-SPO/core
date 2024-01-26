import { loadEnv } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'

const { publicVars } = loadEnv()

export default {
  performance: {
    removeConsole: true,
    removeMomentLocale: true,
    chunkSplit: {
      strategy: 'split-by-experience'
    }
  },
  output: {
    polyfill: 'off'
  },
  source: {
    define: publicVars
  },
  plugins: [pluginPreact()],
  html: {
    template: './index.html'
  }
}
