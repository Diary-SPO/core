import { type Lesson, LessonWorkType } from '@diary-spo/shared'
import {
  InfoRow,
  Popover,
  Separator,
  SimpleCell,
  Spacing,
  Subhead,
  Text
} from '@vkontakte/vkui'
import { type FC, Fragment } from 'react'

import { setDefaultMark, textToLink } from '../../../../../../shared'
import type { ReturnedMark } from '../../../../../../shared/types.ts'
import { Mark } from '../../../../../../shared/ui'

// @TODO: ??
export const getLessonMarkDescription = (
  mark?: ReturnedMark | null
): string | undefined => {
  switch (mark) {
    case 1:
      return 'Оценка 1 — очень плохо'
    case 2:
      return 'Оценка 2 — неудовлетворительно'
    case 3:
      return 'Оценка 3 — удовлетворительно'
    case 4:
      return 'Оценка 4 — хорошо'
    case 5:
      return 'Оценка 5 — отлично'
    case 'Зч':
      return 'Зачёт'
    case 'Д':
      return 'Долг'
    case 'ДЗ':
      return 'Домашнее задание'
    case 'Р':
      return 'Оценка не выставлена'
    case 'Н':
      return 'Отсутствие'
    case 'О':
      return 'Опоздание'
    case 'НП':
      return 'Пропуск по неуважительной причине'
    case 'УП':
      return 'Пропуск по уважительной причине'
    case 'Б':
      return 'Пропуск по болезни'
    case '.':
      return 'Оценка отсутствует'
    default:
      return undefined
  }
}

export const LessonMark: FC<{ mark?: ReturnedMark | null }> = ({ mark }) => {
  const description = getLessonMarkDescription(mark)
  const markElement = <Mark mark={mark} size='s' />

  if (!description) {
    return markElement
  }

  return (
    <Popover
      trigger='click'
      content={<Subhead style={{ padding: 8 }}>{description}</Subhead>}
    >
      <button
        type='button'
        aria-label={description}
        style={{ background: 'none', border: 0, padding: 0 }}
      >
        {markElement}
      </button>
    </Popover>
  )
}

// : ??
interface ILessonTasks {
  tasks: Lesson['gradebook']['tasks']
}

interface Props {
  task: Lesson['gradebook']['tasks'][0]
  index: number
}

const Task: FC<Props> = ({ task, index }) => (
  <Fragment key={`${task?.topic}_${index}`}>
    <SimpleCell multiline after={<LessonMark mark={setDefaultMark(task)} />}>
      <InfoRow header='Тип работы'>{LessonWorkType[task.type]}</InfoRow>
    </SimpleCell>

    <SimpleCell multiline>
      <InfoRow style={{ marginTop: 10 }} header='Тема'>
        <Text>{task?.topic}</Text>
      </InfoRow>
      {task?.condition && (
        <InfoRow style={{ marginTop: 10 }} header='Описание'>
          <Text>{textToLink(task.condition)}</Text>
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
