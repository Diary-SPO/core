import { LessonType, type LessonTypeKeys } from '@diary-spo/shared'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import type { FC } from 'react'

import { textToLink } from '../../../../../../shared'
import { ExplanationTooltip } from '../../../../../../shared/ui'

export interface ILessonMainInfo {
  name: string
  lessonType: LessonTypeKeys
  themes?: string[]
  teacherName: string
}

const LessonMainInfo: FC<{ lessonMainInfo: Partial<ILessonMainInfo> }> = ({
  lessonMainInfo
}) => {
  const header = (
    <Header mode='tertiary'>
      <ExplanationTooltip
        text='Основная информация'
        tooltipContent='Вся информация берется из оригинального дневника и отображается здесь'
      />
    </Header>
  )

  const theme = lessonMainInfo.themes
    ? lessonMainInfo.themes.map((theme) => textToLink(theme))
    : 'Не указана'

  const lessonType =
    (lessonMainInfo.lessonType && LessonType[lessonMainInfo.lessonType]) ??
    'Не указан'

  return (
    <Group header={header}>
      <SimpleCell multiline>
        <InfoRow header='Предмет'>{lessonMainInfo.name}</InfoRow>
      </SimpleCell>
      <SimpleCell>
        <InfoRow header='Тип занятия'>{lessonType}</InfoRow>
      </SimpleCell>
      <SimpleCell multiline>
        <InfoRow header='Тема'>{theme}</InfoRow>
      </SimpleCell>
      <SimpleCell>
        <InfoRow header='Преподаватель'>{lessonMainInfo.teacherName}</InfoRow>
      </SimpleCell>
    </Group>
  )
}

export default LessonMainInfo
