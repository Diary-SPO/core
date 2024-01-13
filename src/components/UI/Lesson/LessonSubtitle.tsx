import { AbsenceTypes, Gradebook, LessonType } from '@diary-spo/shared'
import { FC } from 'react'
import SubtitleWithBorder from '../SubtitleWithBorder'
import TimeRemaining from '../TimeRemaining'

interface ILessonSubtitle {
  gradebook: Gradebook | undefined
  lessonDate: Date
  startTime: string | undefined
  endTime: string | undefined
}

const LessonSubtitle: FC<ILessonSubtitle> = ({
  gradebook,
  lessonDate,
  startTime,
  endTime
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {gradebook?.lessonType && (
        <SubtitleWithBorder style={{ margin: '5px 5px 5px 0px' }}>
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
