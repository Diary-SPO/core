import type { App } from '@diary-spo/api/src/main.ts'
import { treaty } from '@elysiajs/eden'

// @TODO: move to config
export const client = treaty<App>('http://localhost:3003', {
  onRequest: (_path, options) => {
    const headers = new Headers()

    headers.append('secret', localStorage.getItem('token') || '')
    options.headers = headers
  }
})
