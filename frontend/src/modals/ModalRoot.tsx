import { useEffect, useState } from 'react';
import {
  Group, Header, InfoRow, ModalPage, ModalPageHeader, ModalRoot as VKUIModalRoot, SimpleCell,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import {
  Grade, Lesson, LessonType, LessonWorkType, TLesson, TMark,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';

import Mark from '../components/UI/Mark';

import { useModal } from './ModalContext';

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
  const { modalData } = useModal();

  const routeNavigator = useRouteNavigator();
  const { modal: activeModal } = useActiveVkuiLocation();

  const [lessonData, setLessonData] = useState<Lesson>(cleanData);

  useEffect(() => {
    if (modalData) {
      const {
        name, endTime, startTime, timetable, gradebook, tasks: tasksArray,
      } = modalData;

      let lessonName = name || '';

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
          absenceType: gradebook?.absenceType,
          id: gradebook?.id || 0,
          lessonType: gradebook?.lessonType || '',
          tasks: tasksArray,
          themes: gradebook?.themes,
        },
        timetable: {
          classroom: {
            id: 0,
            building: '',
            name: timetable?.classroom?.name || '',
          },
          teacher: {
            id: timetable.teacher?.id || 0,
            lastName: timetable?.teacher?.lastName || '',
            firstName: timetable?.teacher?.firstName || '',
            middleName: timetable?.teacher?.middleName || '',
          },
        },
        startTime: startTime || 'Что-то не так с датой',
        endTime: endTime || 'Что-то не так с датой',
      });
    }
  }, [modalData]);

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={() => routeNavigator.hideModal()}>
      <ModalPage id={MODAL_PAGE_LESSON} size={500} dynamicContentHeight>
        <ModalPageHeader>Подробнее о паре</ModalPageHeader>
        <Group header={<Header mode='tertiary'>Основная информация</Header>}>
          <SimpleCell multiline>
            <InfoRow header='Предмет'>
              {lessonData.name}
            </InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header='Тип занятия'>
              {LessonWorkType[lessonData.gradebook?.lessonType as TLesson]}
            </InfoRow>
          </SimpleCell>
          <SimpleCell multiline>
            <InfoRow header='Тема'>
              {lessonData.gradebook?.themes || 'Не указана'}
            </InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header='Преподаватель'>
              {lessonData?.timetable?.teacher.lastName}
              {' '}
              {lessonData.timetable.teacher.firstName}
              {' '}
              {lessonData.timetable.teacher.middleName}
            </InfoRow>
          </SimpleCell>
        </Group>
        <Group header={<Header mode='tertiary'>Место и время</Header>}>
          <SimpleCell>
            <InfoRow header='Аудитория'>
              {lessonData.timetable.classroom.name}
            </InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header='Время'>
              {lessonData.startTime.toLocaleString()}
              {' '}
              -
              {' '}
              {lessonData.endTime.toLocaleString()}
            </InfoRow>
          </SimpleCell>
        </Group>
        {((lessonData.gradebook?.absenceType && lessonData.gradebook.absenceType === 'IsAbsent')
          || (lessonData.gradebook?.tasks?.length && lessonData.gradebook.tasks.length > 0))
          ? (
            <Group header={<Header mode='tertiary'>Успеваемость</Header>}>
              {lessonData.gradebook?.tasks?.map((tasks, index) => (
                (tasks.isRequired || (Grade[setDefaultMark(tasks)] !== 'Д')) && (
                <SimpleCell key={index} after={<Mark mark={Grade[setDefaultMark(tasks)]} size='s' />}>
                  {LessonType[tasks.type]}
                </SimpleCell>
                )
              ))}
              {lessonData.gradebook?.absenceType === 'IsAbsent' && (
              <SimpleCell after={<Mark mark={'Н' as TMark} size='s' />}>
                Опоздание
              </SimpleCell>
              )}
            </Group>
          ) : null}
      </ModalPage>
    </VKUIModalRoot>
  );
};

export default ModalRoot;
