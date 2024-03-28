import { Day, Task } from '@diary-spo/shared'

export interface LessonGradesProps {
  day: string
  lessonGrades: MarkDetailed[]
}

export interface IPerformanceCurrent {
  lessonsState: Day[]
}

export interface MarkDetailed {
  lessonName: string
  task: Task
}
