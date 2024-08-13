import { type AbsenceType, AbsenceTypes, Grade } from '@diary-spo/shared'
import type { ReactNode } from 'preact/compat'
import { Mark } from '../../../../../../shared/ui'

// TODO: create tests
export const renderMarksOrAbsence = (
  markValues: string[],
  absenceType: AbsenceType
): ReactNode => {
  if (markValues.length) {
    return markValues.map((mark, index) => (
      <Mark
        key={index}
        mark={Grade[mark] || AbsenceTypes[absenceType]}
        size='s'
      />
    ))
  }

  if (absenceType) {
    return <Mark size='s' mark={AbsenceTypes[absenceType]} />
  }

  return undefined
}
