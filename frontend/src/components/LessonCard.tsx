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
  const routeNavigator = useRouteNavigator();
  const [params, setParams] = useSearchParams();

  const handleLessonClick = (
      name: string, endTime: Date | string, startTime: Date | string, timetable: Timetable, gradebook: Gradebook | undefined
    ) => {
    const lessonDate = new Date(lesson.date);
    const lessonId = lessonDate.toISOString();
    params.set('name', name);
    if (typeof endTime === 'string') {
      params.set('endTime', endTime);
    }
    if (typeof startTime === 'string') {
      params.set('startTime', startTime);
    }
    params.set('timetable', JSON.stringify(timetable));
    params.set('gradebook', JSON.stringify(gradebook));
    params.set('tasks', JSON.stringify(gradebook?.tasks));
    params.set('lessonId', lessonId);

    setParams(params);

    routeNavigator.showModal(MODAL_PAGE_LESSON);
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
                onClick={() => handleLessonClick(name, endTime, startTime, timetable, gradebook)}
                key={startTime as unknown as string}
                subtitle={!name || (
                  <>
                    {gradebook?.lessonType
                    && (
                    <div style={{
                      margin: '5px 0', display: 'inline-block', color: 'var(--vkui--color_background_accent_themed)', padding: '3px 5px', borderRadius: '5px', border: '1px solid var(--vkui--color_background_accent_themed)',
                    }}
                    >
                      {LessonWorkType[gradebook?.lessonType]}
                    </div>
                    )}
                    <div>
                      {`${startTime.toLocaleString()} — ${endTime.toLocaleString()}, каб. ${timetable?.classroom.name}`}
                    </div>
                    <div style={{
                      marginBottom: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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
