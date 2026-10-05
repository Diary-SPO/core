import type {
  AcademicRecord,
  AttestationResponse,
  Day,
  NotificationsResponse,
  PerformanceCurrent,
  PersonResponse,
  ResponseLogin,
  UserData
} from '@diary-spo/shared'

import type { DiaryHttpResponse, DiaryHttpTransport } from './transport.ts'

const JSON_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8'
}

export class DiaryClientError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'DiaryClientError'
  }
}

export interface LoginInput {
  login: string
  /**SHA-256/base64 */
  password: string
}

export interface DiaryLoginResult {
  user: ResponseLogin
  responseHeaders: Record<string, string>[]
}

export interface EsiaSettings {
  bindEsiaUrl: string | null
  fromEsia: boolean
  isAvailable: boolean
  esiaOnly: boolean
  loginUrl: string | null
  logoutUrl: string | null
  redirectUri: string | null
  useSaml: boolean
}

export interface EsiaLoginStart {
  loginUrl: string
  responseHeaders: Record<string, string>[]
}

export class DiaryClient {
  private studentId: number | null = null

  constructor(
    private readonly baseUrl: string,
    private readonly transport: DiaryHttpTransport
  ) {}

  async login({ login, password }: LoginInput): Promise<DiaryLoginResult> {
    const responseHeaders: Record<string, string>[] = []
    const collectHeaders = (response: DiaryHttpResponse<unknown>) => {
      responseHeaders.push(response.headers)
    }

    const auth = await this.request<UserData>(
      '/services/security/login',
      {
        method: 'POST',
        body: { login, password, isRemember: true }
      },
      collectHeaders
    )

    const account = await this.request<PersonResponse>(
      '/services/security/account-settings',
      {},
      collectHeaders
    )

    return this.createLoginResult(auth, account, responseHeaders, login)
  }

  async prepareEsiaLogin(redirectUri: string): Promise<EsiaLoginStart> {
    const settingsResponse = await this.requestWithResponse<EsiaSettings>(
      '/services/security/esia-settings'
    )
    const { data: settings } = settingsResponse

    if (!settings.isAvailable || !settings.loginUrl) {
      throw new DiaryClientError('ESIA login is not available', 404)
    }

    const loginUrl = new URL(settings.loginUrl)
    loginUrl.searchParams.set('redirect_uri', redirectUri)

    return {
      loginUrl: loginUrl.toString(),
      responseHeaders: [settingsResponse.headers]
    }
  }

  async completeEsiaLogin(callbackUrl: string): Promise<DiaryLoginResult> {
    const callback = new URL(callbackUrl)
    const error = callback.searchParams.get('error')
    const code = callback.searchParams.get('code')

    if (error) {
      throw new DiaryClientError(`ESIA login failed: ${error}`, 401)
    }
    if (!code) {
      throw new DiaryClientError('ESIA callback has no authorization code', 400)
    }

    const diaryCallbackParams = new URLSearchParams()
    for (const key of ['code', 'scope', 'session_state']) {
      const value = callback.searchParams.get(key)
      if (value) diaryCallbackParams.set(key, value)
    }

    const responseHeaders: Record<string, string>[] = []
    const collectHeaders = (response: DiaryHttpResponse<unknown>) => {
      responseHeaders.push(response.headers)
    }

    await this.request<unknown>(
      `/services/esia/login?${diaryCallbackParams.toString()}`,
      {},
      collectHeaders
    )

    const auth = await this.request<UserData>(
      '/services/security/get-esia-tenants',
      {},
      collectHeaders
    )
    const account = await this.request<PersonResponse>(
      '/services/security/account-settings',
      {},
      collectHeaders
    )

    return this.createLoginResult(auth, account, responseHeaders)
  }

  async logout(): Promise<{ success: true }> {
    this.studentId = null
    await this.transport.clearSession?.()
    return { success: true }
  }

  getLessons(startDate: string, endDate: string): Promise<Day[]> {
    return this.request(
      `/services/students/${this.requireStudentId()}/lessons/${startDate}/${endDate}`
    )
  }

  getPerformance(): Promise<PerformanceCurrent> {
    return this.request(
      `/services/reports/current/performance/${this.requireStudentId()}`
    )
  }

  getAttestation(): Promise<AttestationResponse> {
    return this.request(
      `/services/reports/curator/group-attestation-for-student/${this.requireStudentId()}`
    )
  }

  getFinalMarks(): Promise<AcademicRecord> {
    return this.request(
      `/services/students/${this.requireStudentId()}/attestation`
    )
  }

  getAds(): Promise<NotificationsResponse[]> {
    return this.request('/services/people/organization/news/last/10')
  }

  restoreSession(studentId: number): void {
    this.studentId = studentId
  }

  private requireStudentId(): number {
    if (this.studentId === null) {
      throw new DiaryClientError('Direct diary session is not initialized', 401)
    }

    return this.studentId
  }

  private createLoginResult(
    auth: UserData,
    account: PersonResponse,
    responseHeaders: Record<string, string>[],
    login?: string
  ): DiaryLoginResult {
    const tenant = auth.tenants[auth.tenantName]
    const student = tenant?.studentRole.students[0]
    const organization = tenant?.settings.organization
    const person = account.persons[0]

    if (!student || !organization || typeof student.id !== 'number') {
      throw new DiaryClientError('Unexpected login response', 502)
    }

    this.studentId = student.id

    return {
      user: {
        id: BigInt(student.id),
        groupId: BigInt(student.groupId),
        groupName: student.groupName,
        organization: {
          abbreviation: organization.abbreviation,
          addressSettlement:
            organization.actualAddress ||
            organization.legalAddress ||
            organization.address.mailAddress
        },
        login: (login ?? person?.login ?? '').toLowerCase(),
        phone: person?.phone,
        birthday: person?.birthday ?? '',
        firstName: person?.firstName ?? student.firstName,
        lastName: person?.lastName ?? student.lastName,
        middleName: person?.middleName ?? student.middleName,
        // This is only a local logged-in marker. Direct requests use the native
        // cookie jar and never send this value over the network.
        token: 'direct-session'
      },
      responseHeaders
    }
  }

  private async requestWithResponse<T>(
    path: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {}
  ): Promise<DiaryHttpResponse<T>> {
    const response = await this.transport.request<T>({
      method: options.method ?? 'GET',
      url: `${this.baseUrl.replace(/\/$/, '')}${path}`,
      headers: JSON_HEADERS,
      body: options.body
    })

    if (response.status < 200 || response.status >= 300) {
      throw new DiaryClientError(
        `Diary request failed with status ${response.status}`,
        response.status
      )
    }

    return response
  }

  private async request<T>(
    path: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {},
    onResponse?: (response: DiaryHttpResponse<T>) => void
  ): Promise<T> {
    const response = await this.requestWithResponse<T>(path, options)

    onResponse?.(response)

    return response.data
  }
}
