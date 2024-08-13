import { Mark } from '@components'
import { type Lesson, LessonWorkType } from '@diary-spo/shared'
import { setDefaultMark } from '@utils'
import { InfoRow, Separator, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import { type FC, Fragment } from 'preact/compat'

interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

const Task: FC<{ task: Lesson['gradebook']['tasks'][0]; index: number }> = ({
  task,
  index
}) => (
  <Fragment key={`${task?.topic}_${index}`}>
    {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
    <SimpleCell multiline after={<Mark mark={setDefaultMark(task)} size='s' />}>
      <InfoRow header='Тип работы'>{LessonWorkType[task.type]}</InfoRow>
      <InfoRow style={{ marginTop: 10 }} header='Описание'>
        {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
        <Text>{task?.topic}</Text>
      </InfoRow>
    </SimpleCell>
    <Spacing size={16}>
      <Separator />
    </Spacing>
  </Fragment>
)

const LessonTasks: FC<ILessonTasks> = ({ tasks }) => (
  <Fragment>
    {tasks?.map((task, index) => (
      <Task task={task} index={index} />
    ))}
  </Fragment>
)

export default LessonTasks
