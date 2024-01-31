import { Mark } from '@components'
import { Lesson, LessonWorkType } from '@diary-spo/shared'
import { setDefaultMark } from '@utils'
import { InfoRow, Separator, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import React, { FC, memo } from 'react'

interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

const renderTask = (task: Lesson['gradebook']['tasks'][0], index: number) => (
  <React.Fragment key={`${task?.topic}_${index}`}>
    {/*// @ts-ignore Типы не совместимы*/}
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
  </React.Fragment>
)

const LessonTasks: FC<ILessonTasks> = memo(({ tasks }) => (
  <>{tasks?.map((task, index) => renderTask(task, index))}</>
))

export default LessonTasks
