import { FC } from 'react';
import {
  Card, Group, Header, Placeholder, SimpleCell,
} from '@vkontakte/vkui';

import {
  Day, LessonType, Task, TextMark, TMark,
} from '../../../shared';
import { formatLessonDate } from '../utils/formatLessonDate';
import { Grade } from '../types';
import Mark from './Mark.tsx';

interface ILessonCard {
  lesson: Day;
}
const truncateText = (text: string, maxLength: number, removeIfLess: boolean = true): string => {
  if (removeIfLess && text.length < maxLength) {
    return '';
  }

  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};
const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const setDefaultMark = (task: Task): TextMark => {
    if (task.isRequired && !task.mark) {
      return '';
    }
    return task.mark || '';
  };

  return (
    <Card key={lesson.date as unknown as string}>
      <Group
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
                  {gradebook?.lessonType  &&
                    <div style={{margin: '5px 0', display: "inline-block", color: 'var(--vkui--color_background_accent_themed)', padding: '3px 5px', borderRadius: '5px', border: '1px solid var(--vkui--color_background_accent_themed)' }}>
                      {LessonType[gradebook?.lessonType]}
                    </div>}
                    <div>
                      {`${startTime.toLocaleString()} — ${endTime.toLocaleString()}, каб. ${timetable?.classroom.name}`}
                    </div>
                    <div style={{ marginBottom: 5, display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        {timetable.teacher?.lastName}
                        {' '}
                        {timetable.teacher?.firstName}
                        {' '}
                        {timetable.teacher?.middleName}
                      </div>
                      <div>
                        {gradebook?.tasks?.map((task, index) => (
                          <Mark useMargin={false} mark={Grade[setDefaultMark(task)] as TMark} size='s' key={index} />
                        ))}
                      </div>
                    </div>
                    
                  </>
                )}
              >
                {truncateText(name, 30, false)}
              </SimpleCell>
            )
          ))
        ) : (
          <Placeholder>Пар нет</Placeholder>
        )}
      </Group>
    </Card>
  );
};

export default LessonCard;
