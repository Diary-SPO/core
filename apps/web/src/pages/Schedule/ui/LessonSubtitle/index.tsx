import { AbsenceTypes, type Gradebook, LessonType } from '@diary-spo/shared'
import type { FC } from 'react'

import { isDistant } from '../../../../shared'
import { SubtitleWithBorder } from '../../../../shared/ui'

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
        <SubtitleWithBorder
          color={gradebook.absenceType === 'IsLate' ? 'yellow' : 'red'}
        >
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
