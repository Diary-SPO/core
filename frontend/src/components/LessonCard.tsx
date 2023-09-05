import { FC } from 'react';
import {
  Card, Group, Header, Placeholder, SimpleCell,
} from '@vkontakte/vkui';
import { useRouteNavigator, useSearchParams } from '@vkontakte/vk-mini-apps-router';

import {
  Day, Gradebook, LessonWorkType, Timetable, TMark,
} from '../../../shared';

import setDefaultMark from '../utils/setDefaultMark';
import { formatLessonDate } from '../utils/formatLessonDate';
import { Grade } from '../types';

import { MODAL_PAGE_LESSON } from './ModalRoot';

import Mark from './Mark';
import TimeRemaining from "./TimeRemaining";

interface ILessonCard {
  lesson: Day;
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator();
  const [params, setParams] = useSearchParams();
  
  const handleLessonClick = (name: string, endTime: string, startTime: string, timetable: Timetable, gradebook: Gradebook | undefined) => {
    const lessonDate = new Date(lesson.date);
    const lessonId = lessonDate.toISOString();
    params.set('name', name);
    params.set('endTime', endTime);
    params.set('startTime', startTime);
    params.set('timetable', JSON.stringify(timetable));
    params.set('gradebook', JSON.stringify(gradebook));
    params.set('tasks', JSON.stringify(gradebook?.tasks));
    params.set('lessonId', lessonId);
    
    setParams(params);
    
    routeNavigator.showModal(MODAL_PAGE_LESSON);
  };
  
  const currentDate = new Date();
  const formattedLessonDate = formatLessonDate(lesson.date);
  
  // @ts-ignore
  const lessonYear = lesson.date.substring(0, 4);
  // @ts-ignore
  const lessonMonth = lesson.date.substring(5, 7);
  // @ts-ignore
  const lessonDay = lesson.date.substring(8, 10);
  
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  
  const dayEnded = currentYear === lessonYear && currentMonth === lessonMonth && currentDay > lessonDay;
  
  return (
    <Card key={lesson.date as unknown as string}>
      <Group
        header={
          <Header mode='secondary'>
            {formattedLessonDate}
            {dayEnded ? ' День завершен' : ''}
          </Header>
        }
      >
        {lesson.lessons && lesson.lessons.length > 0 ? (
          lesson.lessons.map(({
                                name, endTime, startTime, timetable, gradebook,
                              }) => (
            name && (
              <SimpleCell
                onClick={() => handleLessonClick(name, endTime, startTime, timetable, gradebook)}
                key={startTime as unknown as string}
                subtitle={!name || (
                  <div>
                    {gradebook?.lessonType && (
                      <div
                        style={{
                          margin: '0 5px 5px 0',
                          display: 'inline-block',
                          color: 'var(--vkui--color_background_accent_themed)',
                          padding: '3px 5px',
                          borderRadius: '5px',
                          border: '1px solid var(--vkui--color_background_accent_themed)',
                        }}
                      >
                        {LessonWorkType[gradebook?.lessonType]}
                      </div>
                    )}
                    <TimeRemaining lessonDate={lesson.date} startTime={startTime} endTime={endTime} />
                    <div>
                      {`${startTime} — ${endTime}, каб. ${timetable?.classroom.name}`}
                    </div>
                    <div
                      style={{
                        marginBottom: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        {timetable.teacher?.lastName}
                        {' '}
                        {timetable.teacher?.firstName}
                        {' '}
                        {timetable.teacher?.middleName}
                      </div>
                      <div style={{ marginBottom: 5 }}>
                        {gradebook?.tasks?.map((task, index) => (
                          <Mark
                            useMargin={false}
                            mark={Grade[setDefaultMark(task)] as unknown as TMark}
                            size='s'
                            key={index}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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

const truncateText = (text: string, maxLength: number, removeIfLess: boolean = true): string => {
  if (removeIfLess && text.length < maxLength) {
    return '';
  }
  
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};
