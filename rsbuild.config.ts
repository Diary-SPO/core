import { loadEnv } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'

const { publicVars } = loadEnv()

export default {
  performance: {
    chunkSplit: {
      strategy: 'split-by-module'
    },
    removeConsole: true,
    removeMomentLocale: true
  },
  output: {
    polyfill: 'off'
  },
  source: {
    // alias: {
    //   '@vkontakte/vkui$': '@vkontakte/vkui/dist/cssm'
    // },
    define: publicVars
  },
  plugins: [pluginPreact()],
  html: {
    template: './index.html'
  }
}
