import { loadEnv } from '@rsbuild/core'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress'
import { pluginReact } from '@rsbuild/plugin-react'

const { publicVars } = loadEnv()

export default {
  dev: {
    hmr: true,
  },
  performance: {
    removeMomentLocale: true,
    chunkSplit: {
      strategy: 'split-by-experience'
    }
  },
  output: {
    polyfill: 'usage'
  },
  analyzerMode: 'static',
  openAnalyzer: false,
  reportFilename: 'report-web.html',
  source: {
    define: publicVars
  },
  plugins: [pluginReact(), pluginImageCompress()],
  html: {
    template: './index.html'
  }
}
