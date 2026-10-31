// @ts-check

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// GitHub Pages: main → корень, pre-main → /pre/
const base = process.env.SITE_BASE || '/'

// https://astro.build/config
export default defineConfig({
  site: 'https://diary-spo.github.io',
  base,
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  build: {
    format: 'directory'
  }
})
