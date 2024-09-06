import {
  type AbsenceType,
  AbsenceTypes,
  Grade,
  type MarkKeys
} from '@diary-spo/shared'
import type { ReactNode } from 'react'

import { Mark } from '../../../../../../shared'

// TODO: create tests
export const renderMarksOrAbsence = (
  markValues: Array<MarkKeys>,
  absenceType?: AbsenceType
): ReactNode => {
  if (markValues.length) {
    return markValues.map((mark, index) => (
      <Mark
        key={index}
        mark={Grade[mark] || (absenceType && AbsenceTypes[absenceType]) || 0}
        size='s'
      />
    ))
  }

  if (absenceType) {
    return <Mark size='s' mark={AbsenceTypes[absenceType]} />
  }

  return undefined
}
