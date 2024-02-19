import { SubtitleWithBorder } from '@components'
import { AbsenceTypes, Gradebook, LessonType } from '@diary-spo/shared'
import { isDistant } from '@utils'
import { FC } from 'preact/compat'
import TimeRemaining from './TimeRemaining.tsx'

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
    <TimeRemaining
      lessonDate={lessonDate}
      startTime={startTime}
      endTime={endTime}
    />
  </div>
)

export default LessonSubtitle
