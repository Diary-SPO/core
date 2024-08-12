import type { App } from '@diary-spo/api/src/main.ts'
import { treaty } from '@elysiajs/eden'

export const client = treaty<App>('http://localhost:3003', {
  headers: {
    secret: localStorage.getItem('token')
  }
})
