import { Mark } from '@components'
import type { Gradebook, Lesson, Timetable } from '@diary-spo/shared'
import { isDistant, setDefaultMark } from '@utils'
import { SimpleCell } from '@vkontakte/vkui'
import type { FC } from 'preact/compat'
import LessonSubtitle from './LessonSubtitle'

import './index.css'

interface ILessonCell {
  lesson: Lesson
  lessonDate: Date
  handleLessonClick: (
    name: string,
    endTime: string,
    startTime: string,
    timetable: Timetable,
    gradebook: Gradebook | undefined
  ) => void
}

const LessonCell: FC<ILessonCell> = ({
  lessonDate,
  lesson,
  handleLessonClick
}) => {
  const { name, endTime, startTime, timetable, gradebook } = lesson

  if (!name) {
    return
  }

  const lessonTime = startTime
    ? `${startTime} — ${endTime}, каб. ${
        isDistant(timetable?.classroom?.name)
          ? 'ДО'
          : timetable?.classroom?.name
      }`
    : 'Нет данных'

  const teacherInfo = timetable?.teacher
    ? `${timetable.teacher?.lastName} ${timetable.teacher?.firstName[0]}. ${timetable.teacher?.middleName[0]}.`
    : 'Не указан'

  return (
    // @ts-ignore Типы не совместимы
    <SimpleCell
      className='lesson'
      onClick={() =>
        handleLessonClick(name, endTime, startTime, timetable, gradebook)
      }
      key={startTime}
      subhead={<div>{lessonTime}</div>}
      subtitle={
        <div>
          <div className='lessonSubtitle'>
            <LessonSubtitle
              cabinetName={timetable?.classroom?.name}
              gradebook={gradebook}
              lessonDate={lessonDate}
              startTime={startTime}
              endTime={endTime}
            />
            <div className='lessonMarks'>
              {gradebook?.tasks?.map(
                (task, index) =>
                  (task.isRequired || setDefaultMark(task)) && (
                    <Mark mark={setDefaultMark(task)} size='s' key={index} />
                  )
              )}
            </div>
          </div>
          <div>{teacherInfo}</div>
        </div>
      }
    >
      {name}
    </SimpleCell>
  )
}

export default LessonCell
