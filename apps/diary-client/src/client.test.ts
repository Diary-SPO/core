import { describe, expect, test } from 'bun:test'
import type { UserData } from '@diary-spo/shared'

import { DiaryClient, DiaryClientError } from './client.ts'
import { extractAuthCookie } from './cookies.ts'
import type {
  DiaryHttpRequest,
  DiaryHttpResponse,
  DiaryHttpTransport
} from './transport.ts'

const userData: UserData = {
  installName: 'СПО',
  localNetwork: false,
  tenantName: 'tenant',
  tenants: {
    tenant: {
      firstName: 'Иван',
      lastName: 'Иванов',
      middleName: 'Иванович',
      isTrusted: true,
      studentRole: {
        id: 1,
        studentGroupId: 42,
        students: [
          {
            id: 7,
            groupId: 42,
            groupName: 'ИС-1',
            firstName: 'Иван',
            lastName: 'Иванов',
            middleName: 'Иванович'
          }
        ]
      },
      settings: {
        organization: {
          abbreviation: 'Колледж',
          actualAddress: 'Томск',
          legalAddress: '',
          address: { mailAddress: '', region: '', settlement: '', kladr: '' }
        } as UserData['tenants'][string]['settings']['organization']
      }
    }
  }
}

class MockTransport implements DiaryHttpTransport {
  requests: DiaryHttpRequest[] = []
  cleared = false

  async request<T>(request: DiaryHttpRequest): Promise<DiaryHttpResponse<T>> {
    this.requests.push(request)

    const data = request.url.endsWith('/services/security/login')
      ? userData
      : request.url.endsWith('/services/security/account-settings')
        ? {
            persons: [
              {
                firstName: 'Иван',
                lastName: 'Иванов',
                middleName: 'Иванович',
                login: 'ivan',
                phone: '+70000000000',
                birthday: '2000-01-01',
                isTrusted: true,
                isEsiaBound: false
              }
            ]
          }
        : []

    return { data: data as T, status: 200, headers: {} }
  }

  async clearSession() {
    this.cleared = true
  }
}

describe('DiaryClient', () => {
  test('extracts the same authentication cookies from a combined header', () => {
    const header =
      '.AspNetCore.Session=session; path=/; httponly, UID=user; path=/, .AspNetCore.Cookies=auth%2Fvalue; expires=Sat, 05 Sep 2027 00:00:00 GMT; httponly'

    const cookie = extractAuthCookie(header)

    expect(cookie).toContain('.AspNetCore.Session=session')
    expect(cookie).toContain('UID=user')
    expect(cookie).toContain('.AspNetCore.Cookies=auth%2Fvalue')
  })

  test('keeps every chunk of a chunked ASP.NET authentication cookie', () => {
    const header =
      'UID=user-id; path=/, .AspNetCore.Cookies=chunks-2; path=/; httponly, .AspNetCore.CookiesC1=first-part; path=/; httponly, .AspNetCore.CookiesC2=second-part; path=/; httponly'

    const cookie = extractAuthCookie(header)

    expect(cookie).toContain('UID=user-id')
    expect(cookie).toContain('.AspNetCore.Cookies=chunks-2')
    expect(cookie).toContain('.AspNetCore.CookiesC1=first-part')
    expect(cookie).toContain('.AspNetCore.CookiesC2=second-part')
  })

  test('keeps cookies without relying on a fixed list of names', () => {
    const header =
      'UID=user; path=/, FutureAuthCookie=value; expires=Sat, 05 Sep 2027 00:00:00 GMT; httponly'

    expect(extractAuthCookie(header)).toBe('UID=user; FutureAuthCookie=value')
  })

  test('logs in, keeps the selected student and builds diary paths', async () => {
    const transport = new MockTransport()
    const client = new DiaryClient('https://poo.tomedu.ru/', transport)

    const user = await client.login({ login: 'IVAN', password: 'hash' })
    await client.getLessons('2026-09-01', '2026-09-07')

    expect(user.groupName).toBe('ИС-1')
    expect(user.organization.addressSettlement).toBe('Томск')
    expect(user.token).toBe('direct-session')
    expect(transport.requests[0].body).toEqual({
      login: 'IVAN',
      password: 'hash',
      isRemember: true
    })
    expect(transport.requests[2].url).toBe(
      'https://poo.tomedu.ru/services/students/7/lessons/2026-09-01/2026-09-07'
    )
  })

  test('requires a restored or freshly authenticated session', async () => {
    const client = new DiaryClient('https://poo.tomedu.ru', new MockTransport())

    expect(() => client.getPerformance()).toThrow(DiaryClientError)
  })

  test('clears the transport session on logout', async () => {
    const transport = new MockTransport()
    const client = new DiaryClient('https://poo.tomedu.ru', transport)

    await client.logout()

    expect(transport.cleared).toBe(true)
  })
})
