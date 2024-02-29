import { Footnote, Header } from '@vkontakte/vkui'
import { CSSProperties, FC } from 'preact/compat'

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
      // @ts-ignore Типы не совместимы
      displayDay && <Footnote style={displayDayStyles}>{displayDay}</Footnote>
    }
  >
    {lessonDayOfWeek} {formattedLessonDate}
  </Header>
)

export default LessonHeader
