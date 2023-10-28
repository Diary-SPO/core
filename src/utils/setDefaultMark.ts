import { Grade, Task, TextMark } from 'diary-shared'
export type ReturnedMark = TextMark | 'Н' | 'ДЗ' | 'О' | 'Д' | number

const setDefaultMark = (task: Task): ReturnedMark => {
  if (task.isRequired && !task.mark) {
    return 'Д'
  }

  if (task.type === 'Home' && !task.mark) {
    return 'ДЗ'
  }

  return Grade[task.mark] as ReturnedMark
}

export default setDefaultMark
