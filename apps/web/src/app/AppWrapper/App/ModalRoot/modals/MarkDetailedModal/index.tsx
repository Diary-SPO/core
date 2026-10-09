import { AbsenceTypes, LessonWorkType } from '@diary-spo/shared'
import { useLessonFocus, useMarkModal } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  Div,
  Group,
  InfoRow,
  ModalPage,
  ModalPageHeader,
  Placeholder,
  SimpleCell,
  Skeleton
} from '@vkontakte/vkui'
import { PAGE_SCHEDULE } from '../../../../../../app/routes/constants.ts'
import { parseRuDate } from '../../../../../../pages/Achievements/Tabs/MarksByGroup/resolveLesson.ts'
import { Mark, setDefaultMark } from '../../../../../../shared'
import { getLessonMarkDescription } from '../LessonModal/LessonTasks.tsx'

const dateWords = (date: Date): string =>
  date
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    .replace(/\s?г\.$/, '')

const formatDate = (
  dateISO?: string,
  fallbackDate?: string
): string | undefined => {
  let date: Date | null = null
  if (dateISO) {
    const [year, month, day] = dateISO.split('-').map(Number)
    if (year && month && day) date = new Date(year, month - 1, day)
  }
  date ??= (fallbackDate && parseRuDate(fallbackDate)) || null
  return date ? dateWords(date) : fallbackDate
}

const MarkDetailedModal = ({ id }: { id: string }) => {
  const routeNavigator = useRouteNavigator()
  const { modalData } = useMarkModal()
  const { focusOn } = useLessonFocus()

  const showLesson = async () => {
    if (!modalData.dateISO || modalData.lessonIndex === undefined) return
    focusOn(modalData.dateISO, modalData.lessonIndex)
    await routeNavigator.replace(PAGE_SCHEDULE)
  }

  const mark = modalData.data
    ? setDefaultMark(modalData.data)
    : modalData.fallbackMark
  const absenceLabel =
    modalData.absenceType && AbsenceTypes[modalData.absenceType]
  const absenceDescription =
    absenceLabel && getLessonMarkDescription(absenceLabel)
  const dateTime = formatDate(modalData.dateISO, modalData.lessonDate)
  const resolved = Boolean(mark || modalData.dateISO)

  if (modalData.loadError && !modalData.dateISO) {
    return (
      <ModalPage id={id} size={500} dynamicContentHeight>
        <ModalPageHeader>Подробнее об оценке</ModalPageHeader>
        <Placeholder>Не удалось загрузить расписание</Placeholder>
      </ModalPage>
    )
  }

  if (!resolved && !modalData.isLoading) {
    return (
      <ModalPage id={id} size={500} dynamicContentHeight>
        <ModalPageHeader>Подробнее об оценке</ModalPageHeader>
        <Placeholder>Не удалось найти пару для этой оценки</Placeholder>
      </ModalPage>
    )
  }

  const markType = modalData.data
    ? mark === 'Р'
      ? 'Оценка не выставлена'
      : (LessonWorkType[modalData.data.type] ??
        (modalData.data.isRequired && !modalData.data.mark && 'Долг') ??
        'Неизвестен')
    : modalData.isLoading
      ? null
      : typeof mark === 'number'
        ? `Оценка ${mark}`
        : undefined

  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
      <ModalPageHeader>Подробнее об оценке</ModalPageHeader>
      <Group>
        <SimpleCell multiline>
          <InfoRow header='Предмет'>{modalData.lessonName}</InfoRow>
        </SimpleCell>
        {dateTime && (
          <SimpleCell multiline>
            <InfoRow header='Дата и время'>
              {dateTime}{' '}
              {modalData.lessonTime
                ? `(${modalData.lessonTime})`
                : modalData.isLoading && (
                    <Skeleton
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle'
                      }}
                      width={110}
                      height={16}
                      borderRadius={8}
                    />
                  )}
            </InfoRow>
          </SimpleCell>
        )}
        {modalData.data?.topic || (!modalData.data && modalData.isLoading) ? (
          <SimpleCell multiline>
            <InfoRow header='Тема'>
              {modalData.data?.topic ?? (
                <Skeleton width={200} height={20} borderRadius={8} />
              )}
            </InfoRow>
          </SimpleCell>
        ) : null}
        {mark && (markType || modalData.isLoading) && (
          <SimpleCell multiline after={<Mark size='s' mark={mark} />}>
            <InfoRow header='Тип оценки'>
              {markType ?? (
                <Skeleton width={140} height={20} borderRadius={8} />
              )}
            </InfoRow>
          </SimpleCell>
        )}
        {absenceDescription && (
          <SimpleCell multiline>
            <InfoRow header='Пропуск'>{absenceDescription}</InfoRow>
          </SimpleCell>
        )}
        {modalData.isLoading ? (
          <Div>
            <Skeleton height={44} borderRadius={10} />
          </Div>
        ) : (
          modalData.dateISO &&
          modalData.lessonIndex !== undefined && (
            <Div>
              <Button size='m' stretched onClick={showLesson}>
                Показать пару в расписании
              </Button>
            </Div>
          )
        )}
      </Group>
    </ModalPage>
  )
}

export default MarkDetailedModal
