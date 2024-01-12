import { AbsenceType, AbsenceTypes, Grade } from '@diary-spo/shared'
import { CSSProperties, ReactNode } from 'react'
import Mark from '../../Mark.tsx'

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
  gap: 5,
  marginLeft: 10
}
