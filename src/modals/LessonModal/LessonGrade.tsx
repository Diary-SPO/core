import { FC } from 'preact/compat'
import { Group, Header, SimpleCell } from '@vkontakte/vkui'
import { AbsenceTypes, AbsenceTypesDescription, Lesson } from 'diary-shared'
import { Mark, ExplanationTooltip } from '@components'
import LessonTasks from './LessonTasks'

interface ILessonGrade {
  tasks: Lesson['gradebook']['tasks']
  absenceType: Lesson['gradebook']['absenceType']
}

const LessonGrade: FC<ILessonGrade> = ({ tasks, absenceType }) => {
  const hasTasks = tasks?.length
  const hasAbsenceType = absenceType

  if (hasTasks || hasAbsenceType) {
    return (
      <Group
        header={
          <Header mode="tertiary">
            <ExplanationTooltip
              text="Успеваемость"
              tooltipContent="Информация может быть неактуальной. При возникновении неточностей можете обратиться к нам"
            />
          </Header>
        }
      >
        {hasTasks && <LessonTasks tasks={tasks} />}
        {hasAbsenceType && (
          <SimpleCell
            after={<Mark mark={AbsenceTypes[absenceType]} size="s" />}
          >
            {AbsenceTypesDescription[absenceType]}
          </SimpleCell>
        )}
      </Group>
    )
  }

  return null
}

export default LessonGrade
