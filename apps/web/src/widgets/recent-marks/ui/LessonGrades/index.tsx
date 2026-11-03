import type { Task } from '@diary-spo/shared'
import { useMarkModal } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import type { FC } from 'react'
import { setDefaultMark } from '../../../../shared'
import { MODAL_PAGE_MARK } from '../../../../shared/config'
import { getBackgroundColor } from '../../../../shared/ui/Mark/helpers'

import './index.css'

interface LessonGradesProps {
  day: string
  lessonGrades: MarkDetailed[]
}

interface MarkDetailed {
  lessonName: string
  task: Task
}

export const LessonGrades: FC<LessonGradesProps> = ({ day, lessonGrades }) => {
  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  if (!lessonGrades.length) {
    return null
  }

  const handleMarkClick = async (data: Task, lessonName: string) => {
    setData({ data, lessonName })
    await routeNavigator.showModal(MODAL_PAGE_MARK)
  }

  return (
    <div className='lessonGrades'>
      <div className='lessonGrades__day'>{day}</div>
      <div className='lessonGrades__row'>
        {lessonGrades.map(({ lessonName, task }) => {
          const value = setDefaultMark(task)
          return (
            <button
              type='button'
              className='lessonGrades__item'
              key={`${lessonName}_${task.id}`}
              onClick={() => void handleMarkClick(task, lessonName)}
            >
              <span
                className='lessonGrades__mark'
                style={{ background: getBackgroundColor(value) }}
              >
                {value}
              </span>
              <span className='lessonGrades__label'>{lessonName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
