import type { Day, Gradebook, Timetable } from '@diary-spo/shared'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Card, Group, Placeholder } from '@vkontakte/vkui'
import type { FC } from 'react'

import { useLessonModal } from '@store'

import {
  GRAY,
  MODAL_PAGE_LESSON,
  VKUI_ACCENT_BG
} from '../../../../shared/config'
import { isToday } from '../../lib'
import { formatLessonDate } from '../../lib/formatLessonDate'
import LessonCell from '../LessonCell'
import LessonHeader from '../LessonHeader.tsx'

interface IDailyCard {
  lesson: Day
}

const DailyCard: FC<IDailyCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator()
  const { setData } = useLessonModal()

  const handleLessonClick = (
    name: string,
    endTime: string,
    startTime: string,
    timetable: Timetable,
    gradebook: Gradebook | undefined
  ) => {
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
    routeNavigator.showModal(MODAL_PAGE_LESSON)
  }

  const currentDate = new Date()
  const lessonDate = new Date(lesson.date)
  const formattedLessonDate = formatLessonDate(lesson.date)
  const lessonDayOfWeek = lessonDate.toLocaleString('ru', {
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
    border: `1px solid ${isLessonToday ? VKUI_ACCENT_BG : GRAY}`
  }

  const dayEnded = currentDate > lessonDate
  const displayDay = isLessonToday
    ? 'Сегодня'
    : dayEnded
      ? 'День завершён'
      : undefined

  // @TODO: ??
  const lessons = lesson.lessons?.map((lesson) => (
    <LessonCell
      key={'lessonId' in lesson ? lesson.lessonId : lesson.startTime}
      lessonDate={lessonDate}
      lesson={lesson}
      handleLessonClick={handleLessonClick}
    />
  ))

  return (
    <Card className='lessonCard' key={lesson.date.toString()}>
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
        {lesson.lessons?.length ? lessons : <Placeholder>Пар нет</Placeholder>}
      </Group>
    </Card>
  )
}

export default DailyCard
