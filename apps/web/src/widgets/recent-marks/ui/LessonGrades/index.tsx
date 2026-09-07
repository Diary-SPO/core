import type { Task } from '@diary-spo/shared'
import { useMarkModal } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import type { FC } from 'react'
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
  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  if (!lessonGrades.length) {
    return
  }

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
          <div className='marksWrapper flex' key={`${lessonName}_${task.id}`}>
            <HorizontalCell
              onClick={() => handleMarkClick(task, lessonName)}
              className='markWrapper'
              size='auto'
            >
              <Mark
                bottom={truncateString(lessonName, 18)}
                mark={setDefaultMark(task)}
              />
            </HorizontalCell>
          </div>
        ))}
      </div>
    </div>
  )
}
