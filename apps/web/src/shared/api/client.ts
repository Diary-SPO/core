import type { App } from '@diary-spo/api/src/main.ts'
import { treaty } from '@elysiajs/eden'

// @TODO: move to config
export const client = treaty<App>('http://localhost:3003', {
  onRequest: (_path, options) => {
    const headers = new Headers()

    headers.append('secret', localStorage.getItem('token') || '')
    /**
     * @TODO: в будущем может потребоваться добавить другой тип (например, form-data).
     * Надо чтобы хедер с типом контента не затирался, т.к. либа умеет его ставить сама
     */
    headers.append('Content-type', 'application/json')
    options.headers = headers
  }
})
