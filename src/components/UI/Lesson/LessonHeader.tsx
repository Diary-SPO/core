import { CSSProperties, FC } from 'react'
import { Footnote, Header } from '@vkontakte/vkui'

interface ILessonHeaderProps {
  lessonDayOfWeek: string | undefined
  formattedLessonDate: string
  displayDayStyles: CSSProperties
  displayDay: string
}

const LessonHeader: FC<ILessonHeaderProps> = ({
  lessonDayOfWeek,
  formattedLessonDate,
  displayDayStyles,
  displayDay,
}) => (
  <Header
    mode="secondary"
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
