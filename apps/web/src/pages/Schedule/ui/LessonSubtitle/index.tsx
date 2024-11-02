import {
  AbsenceTypes,
  AbsenceTypesColors,
  type Gradebook,
  LessonType
} from '@diary-spo/shared'
import type { FC } from 'react'

import { SubtitleWithBorder, isDistant } from '../../../../shared'

import TimeRemaining from '../TimeRemaining.tsx'

import './index.css'

interface ILessonSubtitle {
  cabinetName: string
  gradebook?: Gradebook
  lessonDate: Date
  startTime?: string
  endTime?: string
}

const LessonSubtitle: FC<ILessonSubtitle> = ({
  cabinetName,
  gradebook,
  lessonDate,
  startTime,
  endTime
}) => (
  <div>
    <div className='lessonSubtitle'>
      {isDistant(cabinetName) && (
        <SubtitleWithBorder color='red'> ДО</SubtitleWithBorder>
      )}
      {gradebook?.lessonType && (
        <SubtitleWithBorder>
          {LessonType[gradebook?.lessonType]}
        </SubtitleWithBorder>
      )}
      {gradebook?.absenceType && (
        <SubtitleWithBorder color={AbsenceTypesColors[gradebook?.absenceType]}>
          {AbsenceTypes[gradebook?.absenceType]}
        </SubtitleWithBorder>
      )}
    </div>
    {startTime && endTime && (
      <TimeRemaining
        lessonDate={lessonDate}
        startTime={startTime}
        endTime={endTime}
      />
    )}
  </div>
)

export default LessonSubtitle
