import { Grade, MarkKeys } from '@diary-spo/shared'
import { TermMark } from './types.ts'

export const getMark = (value: MarkKeys): TermMark => {
  const grade = Grade[value]

  if (grade === 'Д') {
    return
  }

  return grade || ''
}
