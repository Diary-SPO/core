// @ts-check

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

/** base для GitHub Pages: main = "/", pre-main = "/pre/" */
const base = process.env.SITE_BASE || '/'

export default defineConfig({
  site: 'https://diary-spo.github.io',
  base,
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  build: {
    format: 'directory'
  }
})
