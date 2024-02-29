import { HorizontalScroll } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { memo } from 'preact/compat'
import { transformData } from './helpers'
import { IPerformanceCurrent } from './types.ts'

import LessonGrades from './LessonGrades'

const MarksByDay: FunctionalComponent<IPerformanceCurrent> = ({
  lessonsState
}) => {
  const data = transformData(lessonsState).reverse()

  if (!data) {
    return undefined
  }

  return (
    <HorizontalScroll
      showArrows
      getScrollToLeft={(i) => i - 120}
      getScrollToRight={(i) => i + 120}
    >
      <div style={{ marginLeft: 10, display: 'flex', gap: 10 }}>
        {data.map(([day, lessonGrades]) => (
          <LessonGrades day={day} lessonGrades={lessonGrades} />
        ))}
      </div>
    </HorizontalScroll>
  )
}

export default memo(MarksByDay)
