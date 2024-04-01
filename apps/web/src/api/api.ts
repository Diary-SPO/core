import { treaty } from '@elysiajs/eden'

import { SERVER_URL } from '@config'

import type { App } from '../../../api/src/main.ts'

// const controller = new AbortController()

export const api = treaty<App>(SERVER_URL, {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    secret: localStorage.getItem('token') ?? localStorage.getItem('token')
  }
  // fetch: {
  //   signal: controller.signal
  // }
})

// setTimeout(() => {
//   controller.abort()
// }, 5000)
