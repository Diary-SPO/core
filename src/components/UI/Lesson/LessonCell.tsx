import { Gradebook, Lesson, Timetable } from '@diary-spo/shared'
import { setDefaultMark } from '@utils'
import { SimpleCell } from '@vkontakte/vkui'
import { FC } from 'react'
import Mark from '../Mark'
import LessonSubtitle from './LessonSubtitle'

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
  // TODO: перенести в функцию
  const lessonTime = startTime
    ? `${startTime} — ${endTime}, каб. ${
        Number(timetable?.classroom?.name) === 0
          ? 'ДО'
          : timetable?.classroom?.name
      }`
    : 'Нет данных'

  const teacherInfo = timetable?.teacher
    ? `${timetable.teacher?.lastName} ${timetable.teacher?.firstName[0]}. ${timetable.teacher?.middleName[0]}.`
    : 'Не указан'

  return (
    name && (
      <SimpleCell
        className='lesson'
        onClick={() =>
          handleLessonClick(name, endTime, startTime, timetable, gradebook)
        }
        key={startTime}
        subtitle={
          !name || (
            <div style={{ width: '100%' }}>
              <LessonSubtitle
                gradebook={gradebook}
                lessonDate={lessonDate}
                startTime={startTime}
                endTime={endTime}
              />
              <div>{lessonTime}</div>
              <div>
                <div>{teacherInfo}</div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 5 }}>
                {gradebook?.tasks?.map(
                  (task, index) =>
                    (task.isRequired || setDefaultMark(task)) && (
                      <Mark mark={setDefaultMark(task)} size='s' key={index} />
                    )
                )}
              </div>
            </div>
          )
        }
      >
        {name}
      </SimpleCell>
    )
  )
}

export default LessonCell
