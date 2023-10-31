import { CardGrid } from '@vkontakte/vkui'
import { Day } from 'diary-shared'
import LessonCard from './LessonCard'
import { FunctionComponent } from 'preact'
import { memo } from 'react'

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FunctionComponent<IScheduleGroup> = ({ lessonsState }) => (
  <CardGrid size="l" spaced>
    {lessonsState?.length &&
      lessonsState?.length > 0 &&
      lessonsState?.map((lesson) => (
        <LessonCard key={lesson.date} lesson={lesson} />
      ))}
  </CardGrid>
)

export default memo(ScheduleGroup)
