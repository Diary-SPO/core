import { ExplanationTooltip, Mark } from '@components'
import {
  AbsenceTypes,
  AbsenceTypesDescription,
  Lesson
} from '@diary-spo/shared'
import { Group, Header, SimpleCell } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import LessonTasks from './LessonTasks'

interface ILessonGrade {
  tasks: Lesson['gradebook']['tasks']
  absenceType: Lesson['gradebook']['absenceType']
}

const LessonGrade: FC<ILessonGrade> = ({ tasks, absenceType }) => {
  const hasTasks = tasks?.length

  if (!hasTasks && !absenceType) {
    return
  }

  const header = (
    <Header mode='tertiary'>
      <ExplanationTooltip
        text='Успеваемость'
        tooltipContent='Информация может быть неактуальной. При возникновении неточностей можете обратиться к нам'
      />
    </Header>
  )

  const mark = <Mark mark={AbsenceTypes[absenceType]} size='s' />

  return (
    <Group header={header}>
      {hasTasks && <LessonTasks tasks={tasks} />}
      {absenceType && (
        // @ts-ignore Типы не совместимы
        <SimpleCell after={mark}>
          {AbsenceTypesDescription[AbsenceTypes[absenceType]]}
        </SimpleCell>
      )}
    </Group>
  )
}

export default LessonGrade
