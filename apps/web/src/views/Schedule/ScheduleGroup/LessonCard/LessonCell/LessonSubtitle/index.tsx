import { SubtitleWithBorder } from '@components'
import { AbsenceTypes, Gradebook, LessonType } from '@diary-spo/shared'
import { FC } from 'react'
import TimeRemaining from './TimeRemaining.tsx'
import { isDistant } from '@utils'

interface ILessonSubtitle {
  cabinetName: string
  gradebook: Gradebook | undefined
  lessonDate: Date
  startTime: string | undefined
  endTime: string | undefined
}

const LessonSubtitle: FC<ILessonSubtitle> = ({
  cabinetName,
  gradebook,
  lessonDate,
  startTime,
  endTime
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
