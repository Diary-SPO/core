import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { DiaryUser } from '@diary-spo/types'

export const getDiaryUser = async (userId: number): Promise<DiaryUser | null> =>
  await createQueryBuilder<DiaryUser>(client)
    .select('*')
    .from('diaryUser')
    .where(`id = ${Number(userId)}`)
    .first()
