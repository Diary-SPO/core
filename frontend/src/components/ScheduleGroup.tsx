import { FC } from 'react';
import { CardScroll, Group, Header } from '@vkontakte/vkui';

import { Day } from '../../../shared';

import LessonCard from './LessonCard';

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FC<IScheduleGroup> = ({ lessonsState }) => (
  <Group header={<Header mode='secondary'>Расписание занятий</Header>}>
    <CardScroll size='l'>
      {lessonsState?.length && lessonsState?.length > 0 && lessonsState?.map((lesson) => (
        <LessonCard key={lesson.date as unknown as string} lesson={lesson} />
      ))}
    </CardScroll>
  </Group>
);

export default ScheduleGroup;
