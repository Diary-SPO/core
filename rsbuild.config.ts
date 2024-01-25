import { loadEnv } from '@rsbuild/core'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress'
import { pluginReact } from '@rsbuild/plugin-react'

const { publicVars } = loadEnv()

export default {
  dev: {
    hmr: true
  },
  performance: {
    profile: true,
    removeConsole: true,
    removeMomentLocale: true,
    chunkSplit: {
      strategy: 'split-by-experience'
    }
  },
  output: {
    outputStructure: 'nested',
    polyfill: 'off'
  },
  analyzerMode: 'static',
  openAnalyzer: true,
  reportFilename: 'report-web.html',
  source: {
    define: publicVars
  },
  plugins: [pluginReact(), pluginImageCompress()],
  html: {
    template: './index.html'
  }
}
