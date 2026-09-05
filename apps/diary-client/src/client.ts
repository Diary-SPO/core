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

import type { DiaryHttpTransport } from './transport.ts'

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

export class DiaryClient {
  private studentId: number | null = null

  constructor(
    private readonly baseUrl: string,
    private readonly transport: DiaryHttpTransport
  ) {}

  async login({ login, password }: LoginInput): Promise<ResponseLogin> {
    const auth = await this.request<UserData>('/services/security/login', {
      method: 'POST',
      body: { login, password, isRemember: true }
    })

    const tenant = auth.tenants[auth.tenantName]
    const student = tenant?.studentRole.students[0]
    const organization = tenant?.settings.organization

    if (!student || !organization || typeof student.id !== 'number') {
      throw new DiaryClientError('Unexpected login response', 502)
    }

    this.studentId = student.id

    const account = await this.request<PersonResponse>(
      '/services/security/account-settings'
    )
    const person = account.persons[0]

    return {
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
      login: login.toLowerCase(),
      phone: person?.phone,
      birthday: person?.birthday ?? '',
      firstName: person?.firstName ?? student.firstName,
      lastName: person?.lastName ?? student.lastName,
      middleName: person?.middleName ?? student.middleName,
      // This is only a local logged-in marker. Direct requests use the native
      // cookie jar and never send this value over the network.
      token: 'direct-session'
    }
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

  private async request<T>(
    path: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {}
  ): Promise<T> {
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

    return response.data
  }
}
