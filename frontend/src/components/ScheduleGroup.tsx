import { FC } from 'react';
// TODO: Сделать переключатель для расписания
// @ts-ignore
import { CardGrid, CardScroll } from '@vkontakte/vkui';
import { Day } from '../../../shared';
import LessonCard from './LessonCard';

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FC<IScheduleGroup> = ({ lessonsState }) => (
  <CardGrid size='l' spaced>
    {lessonsState?.length && lessonsState?.length > 0 && lessonsState?.map((lesson) => (
      <LessonCard key={lesson.date as unknown as string} lesson={lesson} />
    ))}
  </CardGrid>
);

export default ScheduleGroup;
