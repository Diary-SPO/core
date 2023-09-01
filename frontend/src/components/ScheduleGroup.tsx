import { FC, Suspense } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CardScroll, Group, Header } from '@vkontakte/vkui';

import { Day } from '../../../shared/lessons';
import LessonCard from './LessonCard';

interface IScheduleGroup {
  lessonsState?: Day[] | null
}

const ScheduleGroup: FC<IScheduleGroup> = ({ lessonsState }) => {
  const isDesktopOrLaptop = useMediaQuery({ maxWidth: 1224 });

  return (
    <Group header={<Header mode='secondary'>Расписание занятий</Header>}>
      <Suspense fallback={<div>Загрузочка</div>}>
        <CardScroll size={isDesktopOrLaptop ? 'm' : 'l'}>
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
};

export default ScheduleGroup;
