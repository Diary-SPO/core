import { loadEnv } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'

const { publicVars } = loadEnv()

export default {
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience'
    },
    removeConsole: true,
    removeMomentLocale: true
  },
  output: {
    polyfill: 'off'
  },
  source: {
    alias: {
      '@vkontakte/vkui$': '@vkontakte/vkui/dist/cssm'
    },
    define: publicVars
  },
  tools: {
    rspack: {
      experiments: {
        rspackFuture: {
          newTreeshaking: true
        }
      }
    }
  },
  plugins: [pluginPreact()],
  html: {
    template: './index.html'
  }
}
