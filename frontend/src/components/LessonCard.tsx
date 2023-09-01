import { FC } from 'react';
import {
  Card, Group, Header, Placeholder, SimpleCell,
} from '@vkontakte/vkui';
import { Day } from '../../../shared/lessons';
import { formatLessonDate } from '../utils/formatLessonDate';

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
          name, endTime, startTime, timetable,
        }) => (
          name && (
            <SimpleCell
              key={startTime as unknown as string}
              subtitle={!name || (
                <>
                  <div>{`${startTime} — ${endTime}, каб. ${timetable?.classroom.name}`}</div>
                  <div>
                    {timetable?.teacher.lastName}
                    {' '}
                    {timetable?.teacher.firstName}
                    {' '}
                    {timetable?.teacher.middleName}
                  </div>
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
