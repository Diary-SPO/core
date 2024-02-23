import { Mark } from '@components'
import { AbsenceType, AbsenceTypes, Grade, MarkKeys } from '@diary-spo/shared'
import { CSSProperties, ReactNode } from 'preact/compat'
import { Nullable } from '@types'

export const renderMarksOrAbsence = (
  markValues: string[],
  absenceType: AbsenceType
): ReactNode => {
  if (markValues.length && !absenceType) {
    return markValues.map((mark, index) => (
      <Mark key={index} mark={Grade[mark]} size='s' />
    ))
  }

  if (absenceType) {
    return <Mark size='s' mark={AbsenceTypes[absenceType]} />
  }

  return undefined
}

export const styles: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginLeft: 8
}

/**
 * Функция 'calculateAverageMark' высчитывает средний балл учащегося до двух знаков после запятой.
 * Оценки приходят в формате Five, Four и тд.
 * Для верности есть дополнительная валидация оценки.
 */

export const calculateAverageMark = (
  marks: MarkKeys[] | undefined
): Nullable<number> => {
  if (!marks || marks.length === 0) {
    return null
  }

  let sum = 0
  let validMarksCount = 0

  for (const mark of marks) {
    const markNumber = Number(Grade[mark])

    if (Number.isNaN(markNumber)) {
      continue
    }

    sum += markNumber
    validMarksCount++
  }

  if (validMarksCount === 0) {
    return null
  }

  const average = sum / validMarksCount
  return Number(average.toFixed(2))
}
