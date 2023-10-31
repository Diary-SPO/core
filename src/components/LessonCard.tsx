import { CSSProperties, FC, memo } from 'react'
import {
  Card,
  Footnote,
  Group,
  Header,
  Placeholder,
  SimpleCell,
} from '@vkontakte/vkui'
import { formatLessonDate, isToday, setDefaultMark } from '../utils'
import useModal from '../store/useModal.tsx'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useCallback } from 'preact/hooks'
import {
  AbsenceTypes,
  Day,
  Gradebook,
  Lesson,
  LessonWorkType,
  Timetable,
} from 'diary-shared'
import { MODAL_PAGE_LESSON } from '../modals/ModalRoot.tsx'
import SubtitleWithBorder from './UI/SubtitleWithBorder'
import TimeRemaining from './TimeRemaining.tsx'
import Mark from './UI/Mark'

interface ILessonCard {
  lesson: Day
}

interface ILessonHeaderProps {
  lessonDayOfWeek: string | undefined
  formattedLessonDate: string
  displayDayStyles: CSSProperties
  displayDay: string
}

const LessonHeader: FC<ILessonHeaderProps> = ({
  lessonDayOfWeek,
  formattedLessonDate,
  displayDayStyles,
  displayDay,
}) => (
  <Header
    mode="secondary"
    // @ts-ignore
    aside={
      displayDay && <Footnote style={displayDayStyles}>{displayDay}</Footnote>
    }
  >
    {lessonDayOfWeek && `${lessonDayOfWeek}. `}
    {formattedLessonDate}
  </Header>
)

interface ILessonSubtitleProps {
  gradebook: Gradebook | undefined
  lesson: Lesson
  startTime: string | undefined
  endTime: string | undefined
}

const LessonSubtitle: FC<ILessonSubtitleProps> = ({
  gradebook,
  lesson,
  startTime,
  endTime,
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {gradebook?.lessonType && (
        <SubtitleWithBorder style={{ margin: '5px 5px 5px 0px' }}>
          {LessonWorkType[gradebook?.lessonType]}
        </SubtitleWithBorder>
      )}
      {gradebook?.absenceType && (
        <SubtitleWithBorder
          color={gradebook.absenceType === 'IsLate' ? 'yellow' : 'red'}
        >
          {AbsenceTypes[gradebook?.absenceType]}
        </SubtitleWithBorder>
      )}
    </div>
    <TimeRemaining
      /*FIXME*/
      lessonDate={lesson.date}
      startTime={startTime}
      endTime={endTime}
    />
  </div>
)

interface ILessonCellProps {
  lesson: Lesson
  handleLessonClick: (
    name: string,
    endTime: string,
    startTime: string,
    timetable: Timetable,
    gradebook: Gradebook | undefined
  ) => void
}

const LessonCell: FC<ILessonCellProps> = ({ lesson, handleLessonClick }) => {
  const { name, endTime, startTime, timetable, gradebook } = lesson

  const lessonTime = startTime
    ? `${startTime} — ${endTime}, каб. ${
        Number(timetable?.classroom.name) === 0
          ? 'ДО'
          : timetable?.classroom.name
      }`
    : 'Нет данных'

  const teacherInfo = timetable?.teacher
    ? `${timetable.teacher?.lastName} ${timetable.teacher?.firstName[0]}. ${timetable.teacher?.middleName[0]}.`
    : 'Не указан'

  return (
    name && (
      <SimpleCell
        className="lesson"
        onClick={() =>
          handleLessonClick(name, endTime, startTime, timetable, gradebook)
        }
        key={startTime}
        subtitle={
          !name || (
            <div>
              <LessonSubtitle
                gradebook={gradebook}
                lesson={lesson}
                startTime={startTime}
                endTime={endTime}
              />
              <div>{lessonTime}</div>
              <div
                style={{
                  marginBottom: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>{teacherInfo}</div>
                <div style={{ display: 'flex' }}>
                  {gradebook?.tasks?.map(
                    (task, index) =>
                      (task.isRequired || setDefaultMark(task)) && (
                        <Mark
                          useMargin
                          mark={setDefaultMark(task)}
                          size="s"
                          key={index}
                        />
                      )
                  )}
                </div>
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

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator()
  const { setData } = useModal()

  const handleLessonClick = useCallback(
    (
      name: string,
      endTime: string,
      startTime: string,
      timetable: Timetable,
      gradebook: Gradebook | undefined
    ) => {
      routeNavigator.showModal(MODAL_PAGE_LESSON)

      const lessonDate = new Date(lesson.date)
      const lessonId = lessonDate.toISOString()

      const modalData = {
        name,
        endTime,
        startTime,
        timetable,
        gradebook,
        tasks: gradebook?.tasks,
        lessonId,
      }

      setData(modalData)
    },
    []
  )

  const currentDate = new Date()
  const lessonDate = new Date(lesson.date)

  const formattedLessonDate = formatLessonDate(lesson.date)
  const lessonDayOfWeek = lessonDate.toLocaleString('default', {
    weekday: 'long',
  })
  const isLessonToday = isToday(lessonDate)

  const displayDayStyles = {
    color: isLessonToday ? 'var(--vkui--color_background_accent)' : undefined,
    padding: '3px 5px',
    borderRadius: '5px',
    border: `1px solid ${
      isLessonToday ? 'var(--vkui--color_background_accent)' : '#888888'
    }`,
  }

  const dayEnded = currentDate > lessonDate

  const displayDay = dayEnded
    ? ' День завершён'
    : isLessonToday
    ? 'Сегодня'
    : undefined

  return (
    <Card className="lessonCard" key={lesson.date}>
      <Group
        header={
          <LessonHeader
            lessonDayOfWeek={lessonDayOfWeek}
            formattedLessonDate={formattedLessonDate}
            displayDayStyles={displayDayStyles}
            displayDay={displayDay}
          />
        }
      >
        {lesson.lessons && lesson.lessons.length > 0 ? (
          lesson.lessons.map((lesson) => (
            <LessonCell lesson={lesson} handleLessonClick={handleLessonClick} />
          ))
        ) : (
          <Placeholder>Пар нет</Placeholder>
        )}
      </Group>
    </Card>
  )
}

export default memo(LessonCard)
