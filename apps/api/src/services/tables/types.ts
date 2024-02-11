import { Organization } from '@diary-spo/shared'
import { Person } from '@diary-spo/shared/src/base'

/**
 * Структура таблицы, хранящей студента
 */
export interface DiaryUser
  extends Pick<Person, 'id' | 'firstName' | 'lastName' | 'middleName'> {
  spoId?: number
  groupId: number
  login: string
  password: string
  phone: string
  birthday: string
  cookie: string
  cookieLastDateUpdate: string
}

/**
 * Структура таблицы, хронящей информацию о группе студента
 */
export interface Group {
  id?: number
  groupName: string
  diaryGroupId: number
  spoId?: number
}

/**
 * Структура таблицы, хранящей информацию о учебной организации
 */
export interface SPO
  extends Pick<
    Organization,
    | 'abbreviation'
    | 'name'
    | 'shortName'
    | 'actualAddress'
    | 'email'
    | 'site'
    | 'phone'
    | 'type'
    | 'directorName'
  > {
  id?: number
}

export interface PersonResponse {
  person: {
    birthday: string
    id: number
    isEsiaBound: boolean
    login: string
    phone: string
    firstName: string
    isTrusted: boolean
    lastName: string
    middleName: string
  }
}

/**
 * Структура таблицы, содержащей расписание группы
 */
export interface Schedule {
  id?: number
  groupId?: number
  teacherId: number | null
  classroomBuilding: string | null
  classroomName: string | null
  subjectName: string
  date: string
  startTime: string
  endTime: string
}

export interface DBLessonType {
  id: number
  name: string
}

/**
 * Структура таблицы, хранящей задание
 */
export interface GradebookDB {
  id?: number
  scheduleId: number
  lessonTypeId: number
}
//
// /**
//  * Структура таблицы, хранящей тип занятия
//  */
// export interface LessonTypeDB {
//   id?: number
//   name: string
// }
//
// /**
//  * Структура таблицы, хранящей темы
//  */
// export interface ThemeDB {
//   id?: number
//   gradebookId: number
//   description: string
// }
//
// /**
//  * Структура таблицы, хранящей темы занятий
//  */
// export interface TaskDB {
//   id: number
//   gradebookId: number
//   taskTypeId: number
//   topic: string
// }
//
// /**
//  * Структура таблицы, хранящей обязательность выполнения задания (получения оценки)
//  */
// export interface RequiredDB {
//   diaryUserId: number
//   taskId: number
//   isRequired: boolean
// }

/**
 * Структура таблицы, хранящей токены доступа через пользователя
 */
export interface Auth {
  id: number
  idDiaryUser: number
  token: string
  lastUsedDate: string
}

/**
 * Структура ответа на запрос авторизации (/login)
 */
export interface ResponseLogin extends Person {
  spoId?: number
  groupId: number
  organization: {
    abbreviation: string
    addressSettlement: string
  }
  login: string
  phone: string
  birthday: string
  groupName: string
  token: string
}

/**
 * Информация о куках из базы.
 * Не является структурой таблицы.
 */
export interface CookieInfoFromDatabase {
  id: number
  idDiaryUser: number
  token: string
  lastUsedDate: string
  cookie: string
  cookieLastDateUpdate: string
}
