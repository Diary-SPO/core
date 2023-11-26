import { FC } from 'react'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import { LessonWorkType } from '@diary-spo/shared'
import { ExplanationTooltip } from '@components'
import { textToLink } from '@utils'
import { useMemo } from 'preact/compat'

export interface ILessonMainInfo {
  name: string
  lessonType: string
  themes?: string[]
  teacherName: string
}

const LessonMainInfo: FC<{ lessonMainInfo: Partial<ILessonMainInfo> }> = ({
  lessonMainInfo,
}) => {
  const header = useMemo(
    () => (
      <Header mode="tertiary">
        <ExplanationTooltip
          text="Основная информация"
          tooltipContent="Вся информация берется из оригинального дневника и отображается здесь"
        />
      </Header>
    ),
    []
  )

  const theme = lessonMainInfo.themes
    ? lessonMainInfo.themes.map((theme) => textToLink(theme))
    : 'Не указана'

  return (
    <Group header={header}>
      <SimpleCell multiline>
        <InfoRow header="Предмет">{lessonMainInfo.name}</InfoRow>
      </SimpleCell>
      <SimpleCell>
        <InfoRow header="Тип занятия">
          {LessonWorkType[lessonMainInfo.lessonType]}
        </InfoRow>
      </SimpleCell>
      <SimpleCell multiline>
        <InfoRow header="Тема">{theme}</InfoRow>
      </SimpleCell>
      <SimpleCell>
        <InfoRow header="Преподаватель">{lessonMainInfo.teacherName}</InfoRow>
      </SimpleCell>
    </Group>
  )
}

export default LessonMainInfo
