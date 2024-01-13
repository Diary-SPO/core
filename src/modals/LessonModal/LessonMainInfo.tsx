import { ExplanationTooltip } from '@components'
import {LessonType} from '@diary-spo/shared'
import { textToLink } from '@utils'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import { useMemo } from 'preact/compat'
import { FC } from 'react'

export interface ILessonMainInfo {
  name: string
  lessonType: string
  themes?: string[]
  teacherName: string
}

const LessonMainInfo: FC<{ lessonMainInfo: Partial<ILessonMainInfo> }> = ({
  lessonMainInfo
}) => {
  const header = useMemo(
    () => (
      <Header mode='tertiary'>
        <ExplanationTooltip
          text='Основная информация'
          tooltipContent='Вся информация берется из оригинального дневника и отображается здесь'
        />
      </Header>
    ),
    []
  )

  const theme = lessonMainInfo.themes
    ? lessonMainInfo.themes.map((theme) => textToLink(theme))
    : 'Не указана'

  const lessonType = LessonType[lessonMainInfo.lessonType] ?? 'Не указан'

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
