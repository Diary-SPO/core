import { Footnote, Header } from '@vkontakte/vkui'
import type { CSSProperties, FC } from 'react'

interface ILessonHeader {
  lessonDayOfWeek: string | undefined
  formattedLessonDate: string
  displayDayStyles: CSSProperties
  displayDay: string | undefined
}

const LessonHeader: FC<ILessonHeader> = ({
  lessonDayOfWeek,
  formattedLessonDate,
  displayDayStyles,
  displayDay
}) => (
  <Header
    size='s'
    after={
      displayDay && <Footnote style={displayDayStyles}>{displayDay}</Footnote>
    }
  >
    {lessonDayOfWeek} {formattedLessonDate}
  </Header>
)

export default LessonHeader
