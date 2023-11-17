import { FC } from 'react'
import { Lesson, LessonType } from '@diary-spo/shared'
import { InfoRow, Separator, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import { Mark } from '@components'
import { setDefaultMark } from '@utils'

interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

const LessonTasks: FC<ILessonTasks> = ({ tasks }) => (
  <>
    {tasks?.map((task, index) => (
      <>
        <SimpleCell
          multiline
          key={`${task?.topic}_${index}`}
          after={<Mark mark={setDefaultMark(task)} size="s" />}
        >
          <InfoRow header="Тип работы">{LessonType[task.type]}</InfoRow>
          <InfoRow style={{ marginTop: 10 }} header="Описание">
            {/*// @ts-ignore*/}
            <Text>{task?.topic}</Text>
          </InfoRow>
        </SimpleCell>
        <Spacing size={16}>
          <Separator />
        </Spacing>
      </>
    ))}
  </>
)

export default LessonTasks
