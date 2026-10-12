import {
  type AbsenceType,
  AbsenceTypes,
  Grade,
  type MarkKeys
} from '@diary-spo/shared'
import type { ReactNode } from 'react'

import { Mark } from '../../../../../../shared'

export interface MarkSelection {
  markKey: MarkKeys | null
  markIndex: number
  absenceType?: AbsenceType
}

// TODO: create tests
export const renderMarksOrAbsence = (
  markValues: Array<MarkKeys>,
  absenceType: AbsenceType | undefined,
  onSelect: (selection: MarkSelection) => void
): ReactNode => {
  if (markValues.length) {
    return markValues.map((mark, index) => (
      <button
        key={index}
        type='button'
        className='marksList__button'
        onClick={() =>
          onSelect({ markKey: mark, markIndex: index, absenceType })
        }
        aria-label={`Оценка ${Grade[mark] ?? mark}`}
      >
        <Mark
          mark={Grade[mark] || (absenceType && AbsenceTypes[absenceType]) || 0}
          size='s'
        />
      </button>
    ))
  }

  if (absenceType) {
    return (
      <button
        type='button'
        className='marksList__button'
        onClick={() => onSelect({ markKey: null, markIndex: 0, absenceType })}
        aria-label={`Пропуск ${AbsenceTypes[absenceType]}`}
      >
        <Mark size='s' mark={AbsenceTypes[absenceType]} />
      </button>
    )
  }

  return undefined
}
