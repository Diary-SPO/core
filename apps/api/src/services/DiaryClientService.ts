import {
  DiaryClient,
  type DiaryHttpRequest,
  type DiaryHttpTransport
} from '@diary-spo/diary-client'
import ky from 'ky'

import { SERVER_URL } from '@config'
import type { ICacheData } from '@helpers'

class BunDiaryTransport implements DiaryHttpTransport {
  constructor(private readonly cookie: string) {}

  async request<T>({ method, url, headers, body }: DiaryHttpRequest) {
    const response = await ky(url, {
      method,
      headers: {
        ...headers,
        Cookie: this.cookie
      },
      json: body,
      retry: 2,
      throwHttpErrors: false,
      timeout: 10000
    })

    return {
      data: await response.json<T>(),
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
  }
}

export const createDiaryClient = (authData: ICacheData): DiaryClient => {
  const client = new DiaryClient(
    SERVER_URL,
    new BunDiaryTransport(authData.cookie)
  )
  client.restoreSession(authData.idFromDiary)

  return client
}
