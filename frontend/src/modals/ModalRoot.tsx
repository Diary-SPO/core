import { useEffect, useState } from 'react';
import {
  Div,
  Group, Header, ModalPage, ModalPageHeader, ModalRoot as VKUIModalRoot,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import {
  Grade, Lesson, LessonType, LessonWorkType, TLesson,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';
import Mark from "../components/Mark.tsx";
import { useModal } from "./ModalContext.tsx";

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
  console.log(modalData);
  
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
          (tasks.isRequired || (Grade[setDefaultMark(tasks)] !== 'Д')) && (
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
          )
        )) : null}
      </ModalPage>
    </VKUIModalRoot>
  );
};

export default ModalRoot;
