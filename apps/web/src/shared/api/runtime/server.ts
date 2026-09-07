import { client } from '../client.ts'
import type { DiaryApi } from './types.ts'

export const diaryApi: DiaryApi = {
  login: (login, password, isHash) =>
    client.auth.login.post({ login, password, isHash }) as ReturnType<
      DiaryApi['login']
    >,
  logout: () => client.auth.logout.get() as ReturnType<DiaryApi['logout']>,
  getLessons: (startDate, endDate) =>
    client.lessons({ startDate })({ endDate }).get() as ReturnType<
      DiaryApi['getLessons']
    >,
  getPerformance: () =>
    client.performanceCurrent.get() as ReturnType<DiaryApi['getPerformance']>,
  getAttestation: () =>
    client.attestation.get() as ReturnType<DiaryApi['getAttestation']>,
  getFinalMarks: () =>
    client.finalMarks.get() as ReturnType<DiaryApi['getFinalMarks']>,
  getAds: () => client.ads.get() as ReturnType<DiaryApi['getAds']>
}
