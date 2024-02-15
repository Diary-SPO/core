import { MODAL_PAGE_LESSON, VKUI_ACCENT_BG } from '@config'
import { Day, Gradebook, Timetable } from '@diary-spo/shared'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Card, Group, Placeholder } from '@vkontakte/vkui'
import { useMemo } from 'preact/compat'
import { useCallback } from 'preact/hooks'
import { FC, memo } from 'react'
// TODO: fix this path
import useModal from '../../../../app/AppWrapper/App/ModalRoot/modals/LessonModal/hooks/useModal.tsx'
import LessonCell from './LessonCell'
import LessonHeader from './LessonHeader.tsx'
import { formatLessonDate, isToday } from './helpers.ts'

interface ILessonCard {
  lesson: Day
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator()
  const { setData } = useModal()

  const handleLessonClick = useCallback(
    (
      name: string,
      endTime: string,
      startTime: string,
      timetable: Timetable,
      gradebook: Gradebook | undefined
    ) => {
      routeNavigator.showModal(MODAL_PAGE_LESSON)

      const lessonId = lessonDate.toISOString()

      const modalData = {
        name,
        endTime,
        startTime,
        timetable,
        gradebook,
        tasks: gradebook?.tasks,
        lessonId
      }

      setData(modalData)
    },
    []
  )

  const currentDate = new Date()
  const lessonDate = new Date(lesson.date)
  const formattedLessonDate = formatLessonDate(lesson.date)
  const lessonDayOfWeek = lessonDate.toLocaleString('default', {
    weekday: 'long'
  })

  if (lessonDayOfWeek === 'воскресенье') {
    return
  }

  const isLessonToday = isToday(lessonDate)

  const displayDayStyles = {
    color: isLessonToday ? VKUI_ACCENT_BG : undefined,
    padding: '3px 5px',
    borderRadius: '5px',
    border: `1px solid ${isLessonToday ? VKUI_ACCENT_BG : '#888888'}`
  }

  const dayEnded = currentDate > lessonDate
  const displayDay = isLessonToday
    ? 'Сегодня'
    : dayEnded
      ? ' День завершён'
      : undefined

  const lessonComponents = useMemo(() => {
    if (lesson.lessons && lesson.lessons.length > 0) {
      return lesson.lessons.map((lesson) => (
        <LessonCell
          key={lesson.lessonId}
          lessonDate={lessonDate}
          lesson={lesson}
          handleLessonClick={handleLessonClick}
        />
      ))
    }
    return <Placeholder>Пар нет</Placeholder>
  }, [lesson.lessons, lessonDate])

  return (
    <Card className='lessonCard' key={lesson.date}>
      <Group
        header={
          <LessonHeader
            lessonDayOfWeek={lessonDayOfWeek}
            formattedLessonDate={formattedLessonDate}
            displayDayStyles={displayDayStyles}
            displayDay={displayDay}
          />
        }
      >
        {lessonComponents}
      </Group>
    </Card>
  )
}

export default memo(LessonCard)
