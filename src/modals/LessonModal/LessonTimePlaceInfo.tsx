import { FC } from 'react'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import ExplanationTooltip from '../../components/UI/ExplanationTooltip'

export interface ILessonTimePlaceInfo {
  classroomName?: string
  startTime?: string | Date
  endTime?: string | Date
}

const LessonTimePlaceInfo: FC<{
  lessonTimePlaceInfo: ILessonTimePlaceInfo
}> = ({ lessonTimePlaceInfo }) => (
  <Group header={<Header mode="tertiary">Место и время</Header>}>
    <SimpleCell>
      <InfoRow
        header={
          <ExplanationTooltip
            text="Аудитория"
            tooltipContent="Если аудитория не указана, возможно, пара будет удалена"
          />
        }
      >
        {lessonTimePlaceInfo.classroomName === '0' ? (
          <ExplanationTooltip
            text="ДО"
            tooltipContent="Пара будет удалена или будет задано домашнее задание. Уточните у куратора или проверьте в оригинальном дневнике."
          />
        ) : (
          lessonTimePlaceInfo.classroomName
        )}
      </InfoRow>
    </SimpleCell>
    <SimpleCell>
      <InfoRow
        header={
          <ExplanationTooltip
            text="Время"
            tooltipContent="Если время не указано или некорректно, вы увидите текст с ошибкой"
          />
        }
      >
        {lessonTimePlaceInfo.startTime} - {lessonTimePlaceInfo.endTime}
      </InfoRow>
    </SimpleCell>
  </Group>
)

export default LessonTimePlaceInfo
