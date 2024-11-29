import type { ResponseLogin } from '@diary-spo/shared'
import { setToken } from '../../../shared/api/client.ts'

export const saveData = (basePath: ResponseLogin) => {
  const userId = String(basePath.id)
  const token = basePath.token
  const tokenId = basePath.tokenId
  const name = `${String(basePath.lastName)} ${String(
    basePath.firstName
  )} ${String(basePath.middleName)}`
  const org = String(basePath.organization?.abbreviation)
  const city = String(basePath.organization?.addressSettlement)
  const group = String(basePath?.groupName)

  localStorage.setItem('id', userId)
  localStorage.setItem('token', token)

  const userData = {
    name,
    org,
    city,
    group,
    tokenId
  }

  setToken(token)
  localStorage.setItem('data', JSON.stringify(userData))
}

export const loginPattern = /^[a-zA-Z0-9а-яА-ЯёЁ-]+$/
