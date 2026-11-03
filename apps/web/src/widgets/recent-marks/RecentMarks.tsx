import type { Day, Nullable } from '@diary-spo/shared'
import type { FC } from 'react'

import { transformData } from './lib'
import { LessonGrades } from './ui'

import './RecentMarks.styles.css'

export const RecentMarks: FC<{
  lessonsState: Nullable<Day[]>
  shouldReverse?: boolean
}> = ({ lessonsState, shouldReverse }) => {
  const data = transformData(lessonsState)
  if (shouldReverse) data.reverse() // transformData всегда новый массив

  return (
    <div className='recentMarks'>
      <div className='recentMarks__wrapper'>
        {data.map(([day, lessonGrades]) => (
          <LessonGrades key={day} day={day} lessonGrades={lessonGrades} />
        ))}
      </div>
    </div>
  )
}
