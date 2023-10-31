import { FC } from 'react'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import { LessonWorkType, TLesson } from 'diary-shared'
import { ExplanationTooltip } from '@components'
import { textToLink } from '@utils'

export interface ILessonMainInfo {
  name: string
  lessonType: string
  themes?: string[]
  teacherName: string
  classroomName: string
}

const LessonMainInfo: FC<{ lessonMainInfo: Partial<ILessonMainInfo> }> = ({
  lessonMainInfo,
}) => (
  <Group
    header={
      <Header mode="tertiary">
        <ExplanationTooltip
          text="Основная информация"
          tooltipContent="Вся информация берется из оригинального дневника и отображается здесь"
        />
      </Header>
    }
  >
    <SimpleCell multiline>
      <InfoRow header="Предмет">{lessonMainInfo.name}</InfoRow>
    </SimpleCell>
    <SimpleCell>
      <InfoRow header="Тип занятия">
        {LessonWorkType[lessonMainInfo.lessonType as TLesson]}
      </InfoRow>
    </SimpleCell>
    <SimpleCell multiline>
      <InfoRow header="Тема">
        {lessonMainInfo.themes
          ? lessonMainInfo.themes.map((theme) => textToLink(theme))
          : 'Не указана'}
      </InfoRow>
    </SimpleCell>
    <SimpleCell>
      <InfoRow header="Преподаватель">{lessonMainInfo.teacherName}</InfoRow>
    </SimpleCell>
  </Group>
)

export default LessonMainInfo
