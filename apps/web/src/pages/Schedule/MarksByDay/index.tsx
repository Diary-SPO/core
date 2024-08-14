import { HorizontalScroll } from '@vkontakte/vkui'
import type { FunctionalComponent } from 'preact'
import { memo } from 'preact/compat'
import type { MarksByDayMap } from './helpers'

import LessonGrades from './LessonGrades'

const MarksByDay: FunctionalComponent<{ lessonsState: MarksByDayMap }> = ({
  lessonsState
}) => (
  <HorizontalScroll
    showArrows
    getScrollToLeft={(i) => i - 120}
    getScrollToRight={(i) => i + 120}
  >
    <div style={{ marginLeft: 10, display: 'flex', gap: 10 }}>
      {lessonsState.map(([day, lessonGrades]) => (
        <LessonGrades day={day} lessonGrades={lessonGrades} />
      ))}
    </div>
  </HorizontalScroll>
)

export default memo(MarksByDay)
