import type { App } from '@diary-spo/api/src/main.ts'
import { treaty } from '@elysiajs/eden'

// @TODO: mov to config
export const client = treaty<App>('http://localhost:3003', {
  headers: {
    secret: localStorage.getItem('token')
  }
})
