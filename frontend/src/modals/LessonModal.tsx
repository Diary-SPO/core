import { FC, useEffect, useState } from 'react';
import {
  Group, Header, InfoRow, ModalPage, ModalPageHeader, Separator, SimpleCell, Spacing, Text,
} from '@vkontakte/vkui';

import {
  EAbsenceTypes, EAbsenceTypesDescription, Grade, Lesson, LessonType, LessonWorkType, TLesson,
} from '../../../shared';
import setDefaultMark from '../utils/setDefaultMark';
import textToLink from '../utils/textToLink';

import { cleanData } from './data';

import Mark from '../components/UI/Mark';

import { useModal } from './ModalContext';

interface ILessonModal {
  id: string;
}

const LessonModal: FC<ILessonModal> = ({ id }) => {
  const { lessonModalData } = useModal();

  const [lessonData, setLessonData] = useState<Lesson>(cleanData);

  useEffect(() => {
    if (lessonModalData) {
      const {
        name, endTime, startTime, timetable, gradebook, tasks: tasksArray,
      } = lessonModalData;

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
  }, [lessonModalData]);

  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
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
            {lessonData.gradebook?.themes ? lessonData.gradebook?.themes.map((theme) => (
              textToLink(theme)
            )) : 'Не указана'}
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
      {((lessonData.gradebook?.tasks?.length && lessonData.gradebook.tasks.length > 0))
        || (lessonData.gradebook?.themes)
        ? (
          <Group header={<Header mode='tertiary'>Успеваемость</Header>}>
            {lessonData.gradebook.tasks?.map((tasks, index) => (
              <>
                <SimpleCell multiline key={index} after={<Mark mark={Grade[setDefaultMark(tasks)]} size='s' />}>
                  <InfoRow header='Тип работы'>
                    {LessonType[tasks.type]}
                  </InfoRow>
                  <InfoRow style={{ marginTop: 10 }} header='Описание'>
                    <Text>{tasks?.topic}</Text>
                  </InfoRow>
                </SimpleCell>
                <Spacing size={16}>
                  <Separator />
                </Spacing>
              </>
            ))}
            {lessonData.gradebook?.absenceType && (
              <SimpleCell after={<Mark mark={EAbsenceTypes[lessonData.gradebook?.absenceType]} size='s' />}>
                {EAbsenceTypesDescription[EAbsenceTypes[lessonData.gradebook?.absenceType]]}
              </SimpleCell>
            )}
          </Group>
        ) : null}
    </ModalPage>
  );
};

export default LessonModal;
