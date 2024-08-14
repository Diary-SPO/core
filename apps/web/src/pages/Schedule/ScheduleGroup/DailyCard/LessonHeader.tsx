import { Footnote, Header } from '@vkontakte/vkui'
import type { CSSProperties, FC } from 'react'

interface ILessonHeader {
  lessonDayOfWeek: string | undefined
  formattedLessonDate: string
  displayDayStyles: CSSProperties
  displayDay: string
}

const LessonHeader: FC<ILessonHeader> = ({
  lessonDayOfWeek,
  formattedLessonDate,
  displayDayStyles,
  displayDay
}) => (
  <Header
    mode='secondary'
    aside={
      displayDay && <Footnote style={displayDayStyles}>{displayDay}</Footnote>
    }
  >
    {lessonDayOfWeek} {formattedLessonDate}
  </Header>
)

export default LessonHeader
