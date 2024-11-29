import { treaty } from '@elysiajs/eden'

import type { App } from '@diary-spo/api/src/main.ts'

import { b64 } from '@diary-spo/crypto'
import { API_URL } from '../config'

/**
 * fixme: Это надо как-то удалить в будущем
 */
let globalToken: string | null = null
export const setToken = (token: string) => {
  globalToken = token
}

export const getToken = (): string | null => {
  return globalToken ?? localStorage.getItem('token')
}

export const getSecureToken = async () => {
  const data = localStorage.getItem('data')

  if (!data) return

  const tokenId = (await JSON.parse(data)).tokenId
  const token = getToken()

  const tokenObject = {
    token,
    date: new Date().toISOString().substring(0, 10)
  }
  const secureToken = await b64(JSON.stringify(tokenObject))

  return btoa(`${tokenId}:${secureToken}`)
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
