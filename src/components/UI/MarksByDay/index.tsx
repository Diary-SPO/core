import { Day, Task } from '@diary-spo/shared'
import { HorizontalScroll } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { memo } from 'preact/compat'
import LessonGrades, { ILessonGrades } from './LessonGrades'

interface IPerformanceCurrent {
  lessonsState: Day[]
}

export interface IMarksByDay {
  [key: string]: ILessonGrades
}

export interface MarkDetailed {
  lessonName: string
  task: Task
}

const transformData = (lessonsState: Day[]): [string, MarkDetailed[]][] => {
  if (!lessonsState || !lessonsState?.length) {
    return []
  }

  const resultMap = new Map<string, MarkDetailed[]>()

  lessonsState.forEach((lessonDay) => {
    const day = new Date(lessonDay.date).toLocaleDateString('ru')

    lessonDay.lessons?.forEach((lesson) => {
      if (!lesson.name || !lesson.gradebook) {
        return
      }

      const existingTasks = resultMap.get(day) || []

      lesson.gradebook.tasks.forEach((newTask) => {
        console.error('=====')
        console.log(lesson.name)
        if (
          !existingTasks.some(
            (existingTask) => existingTask.task.id === newTask.id
          )
        ) {
          existingTasks.push({ lessonName: lesson.name, task: newTask })
        }
      })

      resultMap.set(day, existingTasks)
    })
  })

  return Array.from(resultMap.entries())
}

const MarksByDay: FunctionalComponent<IPerformanceCurrent> = ({
  lessonsState
}) => {
  const data = transformData(lessonsState).reverse()

  if (!data) {
    return undefined
  }

  return (
    <HorizontalScroll
      showArrows
      getScrollToLeft={(i) => i - 120}
      getScrollToRight={(i) => i + 120}
    >
      <div style={{ marginLeft: 10, display: 'flex', gap: 10 }}>
        {data.map(([day, lessonGrades]) => (
          <LessonGrades day={day} lessonGrades={lessonGrades} />
        ))}
      </div>
    </HorizontalScroll>
  )
}

export default memo(MarksByDay)
