import { ExplanationTooltip, Mark } from '@components'
import {
  AbsenceTypes,
  AbsenceTypesDescription,
  Lesson
} from '@diary-spo/shared'
import { Group, Header, SimpleCell } from '@vkontakte/vkui'
import { FC, useMemo } from 'preact/compat'
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

  const header = useMemo(
    () => (
      <Header mode='tertiary'>
        <ExplanationTooltip
          text='Успеваемость'
          tooltipContent='Информация может быть неактуальной. При возникновении неточностей можете обратиться к нам'
        />
      </Header>
    ),
    []
  )

  const mark = <Mark mark={AbsenceTypes[absenceType]} size='s' />

  return (
    <Group header={header}>
      {hasTasks && <LessonTasks tasks={tasks} />}
      {absenceType && (
        <SimpleCell after={mark}>
          {AbsenceTypesDescription[absenceType]}
        </SimpleCell>
      )}
    </Group>
  )
}

export default LessonGrade
