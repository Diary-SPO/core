import { FC, Suspense } from 'react';
import { CardScroll, Group, Header } from '@vkontakte/vkui';

import { Day } from '../../../shared';

import LessonCard from './LessonCard';

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FC<IScheduleGroup> = ({ lessonsState }) => (
  <Group header={<Header mode='secondary'>Расписание занятий</Header>}>
    <Suspense fallback={<div>Загрузочка</div>}>
      <CardScroll size='l'>
        {lessonsState?.length! > 0
            && lessonsState?.map((lesson) => (
              <Suspense key={lesson.date as unknown as string} fallback={<div>Загрузочка</div>}>
                <LessonCard lesson={lesson} />
              </Suspense>
            ))}
      </CardScroll>
    </Suspense>
  </Group>
);

export default ScheduleGroup;
