import { loadEnv } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'
import { IS_DEV } from './src/config'

const { publicVars } = loadEnv()
console.log(IS_DEV)
export default {
  performance: {
    chunkSplit: {
      strategy: IS_DEV ? 'all-in-one' : 'split-by-experience'
    },
    removeConsole: true,
    removeMomentLocale: true
  },
  output: {
    sourceMap: {
      js: false
    },
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
