import {CSSProperties, FC} from 'react';
import {
  Card, Footnote, Group, Header, Placeholder, SimpleCell,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import {
  Day, Grade, Gradebook, LessonWorkType, Timetable,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';
import { formatLessonDate, getDayOfWeek } from '../utils/formatLessonDate';

import { MODAL_PAGE_LESSON } from '../modals/ModalRoot';

import { useModal } from '../modals/ModalContext';

import SubtitleWithBorder from './SubtitleWithBorder';
import TimeRemaining from './TimeRemaining';
import Mark from './Mark';
import {isToday} from "../utils/isToday.ts";

interface ILessonCard {
  lesson: Day;
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator();

  const { openModal } = useModal();

  const handleLessonClick = (
    name: string,
    endTime: string,
    startTime: string,
    timetable: Timetable,
    gradebook: Gradebook | undefined,
  ) => {
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
  const lessonDayOfWeek = getDayOfWeek(lessonDate);
  const isLessonToday = isToday(lessonDate);
  
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');

  const dayEnded = currentYear === lessonYear && currentMonth === lessonMonth && currentDay > lessonDay;
  
  const displayDay = dayEnded ? ' День завершён' : isLessonToday ? 'Сегодня' : ''
  const displayEndDayStyles = dayEnded && 'var(--vkui--color_icon_negative)';
  const displayCurrDayStyles = isLessonToday && 'var(--vkui--color_background_accent)';
  
  const displayDayStyles: CSSProperties = {
    color: displayEndDayStyles || displayCurrDayStyles || undefined,
    padding: '3px 5px',
    borderRadius: '5px',
    border: `1px solid ${displayEndDayStyles || displayCurrDayStyles}`
  }
  
  return (
    <Card key={lesson.date as unknown as string} style={{ height: '100%' }}>
      <Group
        /* Без этого Group не растягивается и немного уезжает на планшетах */
        style={{ height: '100%', marginTop: '4px' }}
        header={(
          <Header mode='secondary' aside={<Footnote style={displayDayStyles}>{displayDay}</Footnote>}>
            {lessonDayOfWeek && `${lessonDayOfWeek}. `}
            {formattedLessonDate}
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
                      <div style={{ display: 'flex' }}>
                        {gradebook?.lessonType && (
                          <SubtitleWithBorder style={{ margin: '5px 5px 5px 0px' }}>
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
