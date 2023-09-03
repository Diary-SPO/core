import { FC } from 'react';
import {
  Card, Group, Header, Placeholder, SimpleCell, Subhead,
} from '@vkontakte/vkui';

import { Day } from '../../../shared';
import { formatLessonDate } from '../utils/formatLessonDate';
import { Grade } from '../types';

interface ILessonCard {
  lesson: Day
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => (
  <Card key={lesson.date as unknown as string}>
    <Group
      style={{ height: '100%', marginTop: '4px' }}
      header={<Header mode='secondary'>{formatLessonDate(lesson.date)}</Header>}
    >
      {lesson.lessons && lesson.lessons.length > 0 ? (
        lesson.lessons.map(({
          name, endTime, startTime, timetable, gradebook,
        }) => (
          name && (
            <SimpleCell
              key={startTime as unknown as string}
              subtitle={!name || (
                <>
                  <div>
                    {`${startTime.toLocaleString()} — ${endTime.toLocaleString()}, каб. ${timetable?.classroom.name}`}
                  </div>
                  <div>
                    {timetable.teacher?.lastName}
                    {' '}
                    {timetable.teacher?.firstName}
                    {' '}
                    {timetable.teacher?.middleName}
                  </div>
                  {gradebook?.tasks[0]?.mark && (
                  <Subhead style={{
                    borderRadius: 5,
                    backgroundColor: 'var(--vkui--color_background_positive--active)',
                    width: 20,
                    height: 20,
                    paddingTop: 1,
                    marginTop: 8,
                    textAlign: 'center',
                    color: 'white',
                  }}
                  >
                    {`${Grade[gradebook?.tasks[0].mark] || 'Неверная оценка'}`}
                  </Subhead>
                  )}
                </>
              )}
            >
              {name}
            </SimpleCell>
          )
        ))
      ) : (
        <Placeholder>Пар нет</Placeholder>
      )}
    </Group>
  </Card>
);

export default LessonCard;
