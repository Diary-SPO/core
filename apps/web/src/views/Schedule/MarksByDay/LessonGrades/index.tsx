import { Mark } from '@components'
import { MODAL_PAGE_MARK } from '@config'
import { Task } from '@diary-spo/shared'

import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Header, HorizontalCell } from '@vkontakte/vkui'
import { useCallback } from 'preact/hooks'
import { FunctionalComponent } from 'preact'

import { useMarkModal } from '@store'
import { setDefaultMark, truncateString } from '@utils'
import { LessonGradesProps } from '../types.ts'
import './index.css'

const LessonGrades: FunctionalComponent<LessonGradesProps> = ({
  day,
  lessonGrades
}) => {
  if (!lessonGrades.length) {
    return undefined
  }

  const routeNavigator = useRouteNavigator()
  const { setData } = useMarkModal()

  const handleMarkClick = useCallback(
    async (data: Task, lessonName: string) => {
      setData({ data, lessonName })
      await routeNavigator.showModal(MODAL_PAGE_MARK)
    },
    [day, lessonGrades.length]
  )

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
              style={{ maxWidth: 'unset' }}
              key={`${lessonName}_${task.id}_${task.type}`}
            >
              <Mark
                bottom={truncateString(lessonName, 18)}
                style={{ maxWidth: 85 }}
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
