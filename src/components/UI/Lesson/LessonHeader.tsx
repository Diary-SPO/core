import { Footnote, Header } from '@vkontakte/vkui'
import { CSSProperties, FC } from 'react'

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
      // @ts-ignore
      displayDay && <Footnote style={displayDayStyles}>{displayDay}</Footnote>
    }
  >
    {lessonDayOfWeek && `${lessonDayOfWeek}. `}
    {formattedLessonDate}
  </Header>
)

export default LessonHeader
