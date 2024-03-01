import { Day, Nullable } from '@diary-spo/shared'
import { CardGrid } from '@vkontakte/vkui'
import { FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import DailyCard from './DailyCard'

interface IScheduleGroup {
  lessonsState?: Nullable<Day[]>
}

const ScheduleGroup: FunctionComponent<IScheduleGroup> = ({ lessonsState }) => (
  <CardGrid style={{ overflowY: 'auto' }} size='l' spaced>
    {lessonsState?.length &&
      lessonsState.map((lesson, index) => (
        <DailyCard key={`${lesson.date}_${index}`} lesson={lesson} />
      ))}
  </CardGrid>
)

export default memo(ScheduleGroup)
