import { Day } from '@diary-spo/shared'
import { CardGrid } from '@vkontakte/vkui'
import { FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import LessonCard from './LessonCard'

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FunctionComponent<IScheduleGroup> = ({ lessonsState }) => (
  <CardGrid style={{ overflowY: 'auto' }} size='l' spaced>
    {lessonsState?.length &&
      lessonsState?.map((lesson, index) => (
        <LessonCard key={`${lesson.date}_${index}`} lesson={lesson} />
      ))}
  </CardGrid>
)

export default memo(ScheduleGroup)
