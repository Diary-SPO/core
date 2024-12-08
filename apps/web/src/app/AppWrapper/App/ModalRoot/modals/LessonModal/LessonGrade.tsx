import {
  type AbsenceType,
  AbsenceTypes,
  AbsenceTypesDescription,
  type Task
} from '@diary-spo/shared'
import { Group, Header, SimpleCell } from '@vkontakte/vkui'
import type { FC } from 'react'
import { ExplanationTooltip, Mark } from '../../../../../../shared'
import LessonTasks from './LessonTasks'

interface ILessonGrade {
  tasks?: Task[]
  absenceType?: AbsenceType
}

const LessonGrade: FC<ILessonGrade> = ({ tasks, absenceType }) => {
  const hasTasks = Boolean(tasks?.length)

  if (!hasTasks && !absenceType) {
    return
  }

  const header = (
    <Header size='m'>
      <ExplanationTooltip
        text='Успеваемость'
        tooltipContent='Информация может быть неактуальной. При возникновении неточностей можете обратиться к нам'
      />
    </Header>
  )

  const mark = absenceType && <Mark mark={AbsenceTypes[absenceType]} size='s' />

  return (
    <Group header={header}>
      {hasTasks && <LessonTasks tasks={tasks} />}
      {mark && (
        <SimpleCell after={mark}>
          {AbsenceTypesDescription[AbsenceTypes[absenceType]]}
        </SimpleCell>
      )}
    </Group>
  )
}

export default LessonGrade
