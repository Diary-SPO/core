import { CardGrid } from '@vkontakte/vkui'
import { Day } from 'diary-shared'
import { FunctionComponent } from 'preact'
import { memo } from 'react'
import LessonCard from './UI/Lesson/LessonCard'

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FunctionComponent<IScheduleGroup> = ({ lessonsState }) => (
  <CardGrid size="l" spaced>
    {lessonsState?.length &&
      lessonsState?.length > 0 &&
      lessonsState?.map((lesson, index) => (
        <LessonCard key={`${lesson.date}_${index}`} lesson={lesson} />
      ))}
  </CardGrid>
)

export default memo(ScheduleGroup)
