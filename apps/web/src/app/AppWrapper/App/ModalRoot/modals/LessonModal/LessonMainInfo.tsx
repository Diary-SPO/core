import { ExplanationTooltip } from '@components'
import { LessonType } from '@diary-spo/shared'
import { LessonTypeKeys } from '@diary-spo/shared/src/keys'
import { textToLink } from '@utils'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import { FC } from 'preact/compat'

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

  const lessonType = LessonType[lessonMainInfo.lessonType] ?? 'Не указан'

  return (
    <Group header={header}>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell multiline>
        <InfoRow header='Предмет'>{lessonMainInfo.name}</InfoRow>
      </SimpleCell>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell>
        <InfoRow header='Тип занятия'>{lessonType}</InfoRow>
      </SimpleCell>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell multiline>
        <InfoRow header='Тема'>{theme}</InfoRow>
      </SimpleCell>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell>
        <InfoRow header='Преподаватель'>{lessonMainInfo.teacherName}</InfoRow>
      </SimpleCell>
    </Group>
  )
}

export default LessonMainInfo
