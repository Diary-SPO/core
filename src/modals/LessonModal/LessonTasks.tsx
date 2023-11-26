import React, { FC, memo } from 'react'
import { Lesson, LessonType } from '@diary-spo/shared'
import { InfoRow, Separator, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import { Mark } from '@components'
import { setDefaultMark } from '@utils'

interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

const renderTask = (task: Lesson['gradebook']['tasks'][0], index: number) => (
  <React.Fragment key={`${task?.topic}_${index}`}>
    <SimpleCell multiline after={<Mark mark={setDefaultMark(task)} size="s" />}>
      <InfoRow header="Тип работы">{LessonType[task.type]}</InfoRow>
      <InfoRow style={{ marginTop: 10 }} header="Описание">
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
