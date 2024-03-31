import type { Lesson } from '@diary-spo/shared'

/**
 * Функция 'formatLessonName' форматирует название урока, добавляя к нему дополнительную информацию, если есть разделитель '/'.
 * Если переданная строка 'name' содержит '/', функция разбивает её на части, берёт первую часть и добавляет к ней оставшиеся части в скобках.
 * Возвращает отформатированное название урока.
 */

export const formatLessonName = (name: string): string => {
  let lessonName = name
  if (lessonName.includes('/')) {
    const [firstPart, ...additionalParts] = lessonName.split('/')
    lessonName = `${firstPart} (${additionalParts.join('/')})`.trim()
  }
  return lessonName
}

/**
 * Функция 'setLessonDetails' обрабатывает данные урока для модального окна.
 * Она принимает объект урока (типа Lesson) и деконструирует его свойства для формирования структурированного объекта данных.
 * Название урока форматируется с помощью функции 'formatLessonName'.
 * Каждый раздел содержит конкретные детали урока, извлеченные из предоставленного объекта Lesson.
 * Эта функция также обеспечивает резервные значения для отсутствующих или неопределенных свойств в объекте Lesson.
 * Возвращает структурированный объект, содержащий детали урока.
 */

export const setLessonDetails = (lesson: Lesson) => {
  const {
    name,
    endTime,
    startTime,
    timetable,
    gradebook,
    tasks: tasksArray
  } = lesson

  const formattedName = formatLessonName(name)

  return {
    lessonData: {
      name: formattedName,
      gradebook: {
        absenceType: gradebook?.absenceType,
        id: gradebook?.id || 0,
        lessonType: gradebook?.lessonType,
        tasks: tasksArray,
        themes: gradebook?.themes
      },
      timetable: {
        classroom: {
          id: 0,
          building: '',
          name: timetable?.classroom?.name || 'Нет кабинета'
        },
        teacher: {
          id: timetable?.teacher?.id || 0,
          lastName: timetable?.teacher?.lastName || '',
          firstName: timetable?.teacher?.firstName || '',
          middleName: timetable?.teacher?.middleName || ''
        }
      },
      startTime: startTime || 'Что-то не так с датой',
      endTime: endTime || 'Что-то не так с датой'
    },
    lessonMainInfo: {
      name: formattedName,
      lessonType: gradebook?.lessonType,
      themes: gradebook?.themes,
      teacherName: timetable?.teacher?.firstName
        ? `${timetable.teacher.lastName} ${timetable.teacher.firstName} ${timetable.teacher.middleName}`
        : 'Не указан'
    },
    lessonTimePlaceInfo: {
      startTime: startTime || 'Ошибка',
      endTime: endTime || 'Ошибка',
      classroomName: timetable?.classroom?.name || 'Нет кабинета'
    }
  }
}
