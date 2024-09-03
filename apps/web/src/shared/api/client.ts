import { treaty } from '@elysiajs/eden'

import type { App } from '@diary-spo/api/src/main.ts'

import { API_URL } from '../config'

/**
 * fixme: Это надо как-то удалить в будущем
 */
let globalToken: string | null = null
export const setToken = (token: string) => {
  globalToken = token
}
// @TODO: move to config
export const client = treaty<App>(API_URL, {
  onRequest: (_path, options) => {
    const headers = new Headers()

    headers.append('secret', localStorage.getItem('token') || globalToken || '')
    /**
     * @TODO: в будущем может потребоваться добавить другой тип (например, form-data).
     * Надо чтобы хедер с типом контента не затирался, т.к. либа умеет его ставить сама
     */
    headers.append('Content-type', 'application/json')
    options.headers = headers
  }
})
