import { FC } from 'react';
import {
  Card, Group, Header, Placeholder, SimpleCell,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import {
  Day, Grade, Gradebook, LessonWorkType, Timetable,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';
import { formatLessonDate } from '../utils/formatLessonDate';

import { MODAL_PAGE_LESSON } from '../modals/ModalRoot';

import SubtitleWithBorder from './SubtitleWithBorder';
import TimeRemaining from './TimeRemaining';
import Mark from './Mark';
import { useModal } from '../modals/ModalContext';

interface ILessonCard {
  lesson: Day;
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator();

  const { openModal } = useModal();

  const handleLessonClick = (name: string, endTime: string, startTime: string, timetable: Timetable, gradebook: Gradebook | undefined) => {
    routeNavigator.showModal(MODAL_PAGE_LESSON);

    const lessonDate = new Date(lesson.date);
    const lessonId = lessonDate.toISOString();

    const modalData = {
      name,
      endTime,
      startTime,
      timetable,
      gradebook,
      tasks: gradebook?.tasks,
      lessonId,
    };

    openModal(modalData);
  };

  const currentDate = new Date();
  const formattedLessonDate = formatLessonDate(lesson.date);
  const lessonDate = new Date(lesson.date);
  const lessonYear = lessonDate.getFullYear().toString();
  const lessonMonth = (lessonDate.getMonth() + 1).toString().padStart(2, '0');
  const lessonDay = lessonDate.getDate().toString().padStart(2, '0');

  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');

  const dayEnded = currentYear === lessonYear && currentMonth === lessonMonth && currentDay > lessonDay;

  return (
    <Card key={lesson.date as unknown as string} style={{ height: '100%' }}>
      <Group
        /* Без этого Group не растягивается и немного уезжает на планшетах */
        style={{ height: '100%', marginTop: '4px' }}
        header={(
          <Header mode='secondary'>
            {formattedLessonDate}
            {dayEnded ? ' День завершён' : ''}
          </Header>
        )}
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', marginRight: 3 }}>
                        {gradebook?.lessonType && (
                          <SubtitleWithBorder>
                            {LessonWorkType[gradebook?.lessonType]}
                          </SubtitleWithBorder>
                        )}
                        {gradebook?.absenceType && <SubtitleWithBorder color='red'>Н</SubtitleWithBorder>}
                      </div>
                      <TimeRemaining lessonDate={lesson.date} startTime={startTime} endTime={endTime} />
                    </div>
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
                        {timetable.teacher?.firstName[0]}
                        .
                        {' '}
                        {timetable.teacher?.middleName[0]}
                        .
                      </div>
                      <div>
                        {gradebook?.tasks?.map((task, index) => (
                          (task.isRequired || (Grade[setDefaultMark(task)] !== 'Д')) && (
                            <Mark
                              useMargin
                              mark={Grade[setDefaultMark(task)]}
                              size='s'
                              key={index}
                            />
                          )
                        ))}
                      </div>
                    </div>
                  </div>
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
};

export default LessonCard;
