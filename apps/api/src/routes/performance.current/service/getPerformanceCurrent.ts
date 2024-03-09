import { API_CODES, API_ERRORS, ApiError } from "@api"
import { SERVER_URL } from "@config"
import { PerformanceCurrent } from "@diary-spo/shared"
import { ICacheData } from "@helpers"
import { HeadersWithCookie } from "@utils"

export const getPerformanceCurrent = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  const response = fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })
  return response
}