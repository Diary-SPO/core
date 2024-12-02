import type { Task } from '@diary-spo/shared'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import type { FC } from 'react'

import { useMarkModal } from '@store'
import { Mark, setDefaultMark, truncateString } from '../../../../shared'
import { MODAL_PAGE_MARK } from '../../../../shared/config'

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
  if (!lessonGrades.length) {
    return
  }

  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  const handleMarkClick = async (data: Task, lessonName: string) => {
    setData({ data, lessonName })
    await routeNavigator.showModal(MODAL_PAGE_MARK)
  }

  return (
    <div key={day}>
      <Header size='s' className='recentMarks'>
        {day}
      </Header>
      <div className='flex'>
        {lessonGrades.map(({ lessonName, task }) => (
          <HorizontalCell
            size='xl'
            onClick={() => handleMarkClick(task, lessonName)}
            className='markWrapper'
          >
            <Mark
              bottom={truncateString(lessonName, 18)}
              mark={setDefaultMark(task)}
            />
          </HorizontalCell>
        ))}
      </div>
    </div>
  )
}
