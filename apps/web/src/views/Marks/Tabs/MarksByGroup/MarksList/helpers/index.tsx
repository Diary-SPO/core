import { Mark } from '@components'
import { AbsenceType, AbsenceTypes, Grade } from '@diary-spo/shared'
import { ReactNode } from 'preact/compat'

// TODO: create tests
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
