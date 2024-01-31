import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { protectInjection } from '../../../utils/protectInjection'
import { DBLessonType } from '../types'

export const updateLessonType = async (
  name: string
): Promise<DBLessonType | null> => {
  const updateLessonTypeQueryBuilder = createQueryBuilder<DBLessonType>(client)
    .select('*')
    .from('lessonType')
    .where(`name = '${protectInjection(name)}'`)

  const existingLessonType = await updateLessonTypeQueryBuilder.first()

  if (existingLessonType) {
    return existingLessonType
  }

  return (
    (
      await updateLessonTypeQueryBuilder.insert({
        name
      })
    )?.[0] ?? null
  )
}
