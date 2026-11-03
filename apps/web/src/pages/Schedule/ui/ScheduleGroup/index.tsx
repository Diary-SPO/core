import type { Day, Nullable } from '@diary-spo/shared'
import { CardGrid } from '@vkontakte/vkui'
import { type FC, useRef } from 'react'

import type { WeekDirection } from '../ScheduleAsideButtons'
import DailyCard from '../DailyCard'

interface IScheduleGroup {
  lessonsState: Nullable<Day[]>
  onSwipeWeek?: (direction: WeekDirection) => void
}

const SWIPE_MIN_PX = 56

const ScheduleGroup: FC<IScheduleGroup> = ({ lessonsState, onSwipeWeek }) => {
  const start = useRef<{ x: number; y: number } | null>(null)

  return (
    <CardGrid
      style={{ overflowY: 'auto', touchAction: 'pan-y' }}
      size='l'
      onTouchStart={(event) => {
        const touch = event.changedTouches[0]
        start.current = { x: touch.clientX, y: touch.clientY }
      }}
      onTouchEnd={(event) => {
        if (!start.current || !onSwipeWeek) return
        const touch = event.changedTouches[0]
        const dx = touch.clientX - start.current.x
        const dy = touch.clientY - start.current.y
        start.current = null
        if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.25) {
          return
        }
        onSwipeWeek(dx < 0 ? 'next' : 'prev')
      }}
    >
      {lessonsState?.length &&
        lessonsState.map((lesson, index) => (
          <DailyCard key={`${lesson.date}_${index}`} lesson={lesson} />
        ))}
    </CardGrid>
  )
}

export default ScheduleGroup
