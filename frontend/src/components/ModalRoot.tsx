import { useEffect, useState } from 'react';
import {
  Div,
  Group, Header, ModalPage, ModalPageHeader, ModalRoot as VKUIModalRoot,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator, useSearchParams } from '@vkontakte/vk-mini-apps-router';

import {
  Grade, Lesson, LessonType, LessonWorkType, Task, TLesson,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';

import Mark from './Mark';

export const MODAL_PAGE_LESSON = 'lesson';

const cleanData: Lesson = {
  name: '',
  gradebook: {
    id: 0,
    lessonType: '',
    tasks: [],
    themes: [],
  },
  timetable: {
    classroom: {
      building: '',
      id: 0,
      name: '',
    },
    teacher: {
      id: 0,
      lastName: '',
      firstName: '',
      middleName: '',
    },
  },
  startTime: '',
  endTime: '',
};

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator();
  const { modal: activeModal } = useActiveVkuiLocation();
  const [params] = useSearchParams();
  const [lessonData, setLessonData] = useState<Lesson>(cleanData);
  let tasksArray: Task[] = [];

  const lessonId = params.get('lessonId');

  useEffect(() => {
    if (lessonId) {
      const timetableParam = params.get('timetable');
      const gradebookParam = params.get('gradebook');
      const tasksParam = params.get('tasks');

      if (tasksParam) {
        try {
          tasksArray = JSON.parse(tasksParam);
        } catch (error) {
          console.error('Ошибка при парсинге строки tasksParam:', error);
        }
      }

      let parsedTimetable;
      let parsedGradebook;

      try {
        parsedTimetable = timetableParam ? JSON.parse(timetableParam) : undefined;
        parsedGradebook = gradebookParam !== undefined && gradebookParam ? JSON.parse(gradebookParam) : undefined;
      } catch (err) {
        console.log(err);
      }

      let lessonName = params.get('name') || '';

      if (lessonName.includes('/')) {
        const parts = lessonName.split('/');

        if (parts.length >= 2) {
          lessonName = parts[0];
          const additionalInfo = parts.slice(1).join('/');

          if (additionalInfo.trim()) {
            lessonName += ` (${additionalInfo})`;
          }
        }
      }

      setLessonData({
        name: lessonName,
        gradebook: {
          id: parsedGradebook?.id || 0,
          lessonType: parsedGradebook?.lessonType || '',
          tasks: tasksArray,
          themes: parsedGradebook?.themes,
        },
        timetable: {
          classroom: {
            id: 0,
            building: '',
            name: parsedTimetable?.classroom?.name || '',
          },
          teacher: {
            id: parsedTimetable.teacher?.id || 0,
            lastName: parsedTimetable?.teacher?.lastName || '',
            firstName: parsedTimetable?.teacher?.firstName || '',
            middleName: parsedTimetable?.teacher?.middleName || '',
          },
        },
        startTime: params.get('startTime') || 'Что-то не так с датой',
        endTime: params.get('endTime') || 'Что-то не так с датой',
      });
    }
  }, [params, lessonId]);

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={() => routeNavigator.hideModal()}>
      <ModalPage id={MODAL_PAGE_LESSON} size={500} dynamicContentHeight>
        <ModalPageHeader>Подробнее о паре</ModalPageHeader>
        <Group header={<Header mode='tertiary'>Основная информация</Header>}>
          <Div>{lessonData.name}</Div>
          <Div>
            Тип занятия:
            {' '}
            {LessonWorkType[lessonData.gradebook?.lessonType as TLesson]}
          </Div>
          <Div>
            Тема:
            {' '}
            {lessonData.gradebook?.themes || 'не задана'}
          </Div>
        </Group>
        <Group header={<Header mode='tertiary'>Куда бежать</Header>}>
          <Div>
            Аудитория:
            {' '}
            {lessonData.timetable.classroom.name}
          </Div>
          <Div>
            Время:
            {' '}
            {lessonData.startTime.toLocaleString()}
            {' '}
            -
            {lessonData.endTime.toLocaleString()}
          </Div>
        </Group>
        <Group header={<Header mode='tertiary'>Кто ведёт</Header>}>
          <Div>
            {`${lessonData?.timetable?.teacher.lastName} ${lessonData.timetable.teacher.firstName} ${lessonData.timetable.teacher.middleName}`}
          </Div>
        </Group>
        {lessonData.gradebook?.tasks?.length && lessonData.gradebook?.tasks.length > 0 ? lessonData.gradebook?.tasks.map((tasks, index) => (
          <Group
             // Тут валидный ts-ignore т.к. из-за условия lessonData.gradebook?.tasks?.length &&... у нас 100% есть какая-то запись в массиве
             // @ts-ignore
            key={lessonData?.gradebook?.tasks[index]?.id}
            header={<Header mode='tertiary' aside={<Mark mark={Grade[setDefaultMark(tasks)]} size='s' />}>Оценка за пару</Header>}
          >
            <Div>
              Тип оценки:
              {' '}
              {LessonType[tasks.type]}
            </Div>
          </Group>
        )) : ''}
      </ModalPage>
    </VKUIModalRoot>
  );
};

export default ModalRoot;
