import { HorizontalScroll } from '@vkontakte/vkui'
import type { MarksByDayMap } from './helpers'

import { type FC, memo } from 'react'
import LessonGrades from './LessonGrades'

const MarksByDay: FC<{ lessonsState: MarksByDayMap }> = ({ lessonsState }) => (
  <HorizontalScroll
    showArrows
    getScrollToLeft={(i) => i - 120}
    getScrollToRight={(i) => i + 120}
  >
    <div style={{ marginLeft: 10, display: 'flex', gap: 10 }}>
      {lessonsState.map(([day, lessonGrades]) => (
        <LessonGrades key={day} day={day} lessonGrades={lessonGrades} />
      ))}
    </div>
  </HorizontalScroll>
)

export default memo(MarksByDay)
