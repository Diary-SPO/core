import {Day, PerformanceCurrent} from '@diary-spo/shared'
import { extractMarksByDay, sortByDay } from '@utils'
import { HorizontalScroll } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { memo } from 'preact/compat'
import LessonGrades, { ILessonGrades } from './LessonGrades'

interface IPerformanceCurrent {
  performanceData: PerformanceCurrent | null
  lessonsState: Day[]
}

export interface IMarksByDay {
  [key: string]: ILessonGrades
}

const MarksByDay: FunctionalComponent<IPerformanceCurrent> = ({
  performanceData,
    lessonsState
}) => {
  const marksByDay = extractMarksByDay(performanceData)
  const sortedMarksByDay = sortByDay(marksByDay)
  console.warn(lessonsState)
  const day = new Date(lessonsState[0].date).toLocaleDateString('ru')
  console.warn(day)
  return (
    <HorizontalScroll
      showArrows
      getScrollToLeft={(i) => i - 120}
      getScrollToRight={(i) => i + 120}
    >
      <div style={{ marginLeft: 10, display: 'flex', gap: 10 }}>
        {Object.entries(sortedMarksByDay).map(([day, lessonGrades]) => (
          <LessonGrades day={day} lessonGrades={lessonGrades} />
        ))}
      </div>
    </HorizontalScroll>
  )
}

export default memo(MarksByDay)
