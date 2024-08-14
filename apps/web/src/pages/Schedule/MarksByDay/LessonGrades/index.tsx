import type { Task } from '@diary-spo/shared'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import type { FC } from 'react'

import { useMarkModal } from '@store'
import { setDefaultMark, truncateString } from '../../../../shared'
import { MODAL_PAGE_MARK } from '../../../../shared/config'
import { Mark } from '../../../../shared/ui'

import type { LessonGradesProps } from '../types.ts'

import './index.css'

const LessonGrades: FC<LessonGradesProps> = ({ day, lessonGrades }) => {
  if (!lessonGrades.length) {
    return undefined
  }

  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  const handleMarkClick = async (data: Task, lessonName: string) => {
    setData({ data, lessonName })
    await routeNavigator.showModal(MODAL_PAGE_MARK)
  }

  return (
    <div key={day}>
      <Header mode='secondary' className='recentMarks'>
        {day}
      </Header>
      <div className='flex'>
        {lessonGrades.map(({ lessonName, task }) => (
          <div className='marksWrapper flex' key={`${lessonName}_${task.id}`}>
            {/*@ts-ignore Типы не совместимы*/}
            <HorizontalCell
              onClick={() => handleMarkClick(task, lessonName)}
              className='markWrapper'
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

export default LessonGrades
