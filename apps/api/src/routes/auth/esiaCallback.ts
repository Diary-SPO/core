import { Elysia } from 'elysia'

const mobileCallbackUrl = 'io.github.diaryspo://esia'

export const EsiaCallbackController = new Elysia().get(
  '/esia/callback',
  ({ query, redirect, status }) => {
    if (query.target === 'webview') {
      return new Response(
        '<!doctype html><html lang="ru"><meta charset="utf-8"><title>Вход завершён</title><body><p>Вход завершён. Можно вернуться в приложение.</p></body></html>',
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store'
          }
        }
      )
    }

    if (query.target === 'web') {
      return status(501, 'Web ESIA login is not enabled yet')
    }

    if (query.target !== 'mobile') {
      return status(400, 'Unsupported ESIA callback target')
    }

    const callback = new URL(mobileCallbackUrl)
    for (const [key, value] of Object.entries(query)) {
      if (key !== 'target' && value !== undefined) {
        callback.searchParams.set(key, value)
      }
    }

    return redirect(callback.toString(), 302)
  },
  {
    detail: {
      tags: ['Auth']
    }
  }
)
