import { ExplanationTooltip } from '@components'
import { isDistant } from '@utils'
import { Group, Header, InfoRow, SimpleCell } from '@vkontakte/vkui'
import { type FC, useMemo } from 'preact/compat'

export interface ILessonTimePlaceInfo {
  classroomName?: string
  startTime?: string | Date
  endTime?: string | Date
}

const LessonTimePlaceInfo: FC<{
  lessonTimePlaceInfo: ILessonTimePlaceInfo
}> = ({ lessonTimePlaceInfo }) => {
  const header = useMemo(
    () => (
      <ExplanationTooltip
        text='Аудитория'
        tooltipContent='Если аудитория не указана, возможно, пара будет удалённо'
      />
    ),
    []
  )

  const homeStudyTooltip = useMemo(
    () => (
      <ExplanationTooltip
        text='ДО'
        tooltipContent='Пара будет удалённо или будет задано домашнее задание. Уточните у куратора или проверьте в оригинальном дневнике.'
      />
    ),
    []
  )

  const timeTooltip = useMemo(
    () => (
      <ExplanationTooltip
        text='Время'
        tooltipContent='Если время не указано или некорректно, вы увидите текст с ошибкой'
      />
    ),
    []
  )

  const className = isDistant(lessonTimePlaceInfo.classroomName)
    ? homeStudyTooltip
    : lessonTimePlaceInfo.classroomName

  return (
    <Group header={<Header mode='tertiary'>Куда бежать</Header>}>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell>
        <InfoRow header={header}>{className}</InfoRow>
      </SimpleCell>
      {/*// @ts-ignore Типы не совместимы*/}
      <SimpleCell>
        <InfoRow header={timeTooltip}>
          {lessonTimePlaceInfo.startTime} - {lessonTimePlaceInfo.endTime}
        </InfoRow>
      </SimpleCell>
    </Group>
  )
}

export default LessonTimePlaceInfo
