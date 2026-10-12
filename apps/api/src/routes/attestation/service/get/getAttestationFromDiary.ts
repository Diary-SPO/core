import type { AttestationResponse } from '@diary-spo/shared'

import type { ICacheData } from '@helpers'
import { createDiaryClient } from 'src/services/DiaryClientService'

export const getAttestationFromDiary = async (
  authData: ICacheData
): Promise<AttestationResponse | null> => {
  try {
    return await createDiaryClient(authData).getAttestation()
  } catch {
    return null
  }
}
