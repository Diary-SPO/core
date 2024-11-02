import { type Lesson, LessonWorkType } from '@diary-spo/shared'
import { InfoRow, Separator, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import { type FC, Fragment } from 'react'

import { setDefaultMark } from '../../../../../../shared'
import { Mark } from '../../../../../../shared/ui'

// @TODO: ??
interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

interface Props {
  task: Lesson['gradebook']['tasks'][0]
  index: number
}

const Task: FC<Props> = ({ task, index }) => (
  <Fragment key={`${task?.topic}_${index}`}>
    <SimpleCell multiline after={<Mark mark={setDefaultMark(task)} size='s' />}>
      <InfoRow header='Тип работы'>{LessonWorkType[task.type]}</InfoRow>
    </SimpleCell>

    <SimpleCell multiline>
      <InfoRow style={{ marginTop: 10 }} header='Тема'>
        <Text>{task?.topic}</Text>
      </InfoRow>
      {task?.condition && (
        <InfoRow style={{ marginTop: 10 }} header='Описание'>
          <Text>{task?.condition}</Text>
        </InfoRow>
      )}
    </SimpleCell>

    <Spacing size={16}>
      <Separator />
    </Spacing>
  </Fragment>
)

const LessonTasks: FC<ILessonTasks> = ({ tasks }) => (
  <>
    {tasks?.map((task, index) => (
      <Task key={`${task}_${index}`} task={task} index={index} />
    ))}
  </>
)

export default LessonTasks
