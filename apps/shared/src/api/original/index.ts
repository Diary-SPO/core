// Эти данные приходят с бэка сетевого города, типизация актуальна на момент 04.09.23
// В некоторых местах типизация может быть не полной
import type { Person } from '../../base.ts'
import type {
  AbsenceTypesDescriptionKeys,
  AbsenceTypesKeys,
  AdditionalMarks,
  ExaminationKeys,
  LessonTypeKeys,
  LessonWorkTypeKeys,
  TermSubjectExaminationKeys
} from './keys.ts'

export interface Organization {
  // Example: 'spo'
  organizationType: string
  name: string
  shortName: string
  abbreviation: string
  legalStatus: 'StateFinanced' | string
  address: {
    region: string
    // Example: 'г. Томск'
    settlement: string
    mailAddress: string
    // Example: '70000001000000000'
    kladr: string
  }
  organizationDeptId: 1
  phone: string
  fax: string
  email: string
  site: string
  directorName: string
  directorPosition: string
  // Example: ''
  studyUnitNumber: string
  // Example: 'Function'
  organizationStatus: string
  isEntrepreneurOwned: boolean
  // Example: ''
  entrepreneurName: string
  // Example: '4e97a34f-b553-42ec-8c26-bc30332d0661'
  organizationId: string
  // Example: ''
  headOrganizationName: string
  isSubdepartment: boolean
  // Example: ''
  additionalName: string
  type: string
  legalAddress: string
  actualAddress: string
  bankingDetails: {
    okved: string
    inn: string
    kpp: string
    ogrn: string
    oktmo: string
    okopth: string
    okths: string
    okpo: string
    others: string
    okogu: string
    founderType: string
    // Example: ''
    founders: string
    okato: string
  }
  administration: {
    eService: {
      isEnabled: true
      cacheEnrolleeListTimeout: number
      cacheSpecialtyListTimeout: number
      cacheEnrolleeTimeout: number
      useRestIntegration: true
    }
    // Example: 4e97a34f-b553-42ec-8c26-bc30332d0661
    organizationId: string
    attestation: {
      isEnabled: boolean
    }
    factHours: {
      isEnabled: boolean
    }
    vkChats: {
      communityId: string
      communityToken: string
    }
  }
}

export interface DashboardSubject {
  id: number
  mark: number
  name: string
}

export interface Dashboard {
  subjects: Array<DashboardSubject>
}

export type TenantName = string

export interface AuthStudent extends Person {
  groupId: number
  groupName: string
}

export interface Tenants {
  [key: TenantName]: {
    firstName: string
    isTrusted: boolean
    lastName: string
    middleName: string
    studentRole: {
      students: AuthStudent[]
      id: number
      studentGroupId: number
    }
    settings: {
      organization: Organization
    }
  }
}

export interface UserData {
  installName: string
  localNetwork: boolean
  tenantName: TenantName
  tenants: Tenants
}

export const LessonWorkType: Record<LessonWorkTypeKeys, string> = {
  Lesson: 'Ответ на занятии',
  Control: 'Контрольная работа',
  Independent: 'Самостоятельная работа',
  Laboratory: 'Лабораторная работа',
  Slice: 'Срезовая работа',
  Home: 'Домашнее задание',
  Test: 'Тест',
  Review: 'Реферат',
  Report: 'Доклад',
  Colloquium: 'Коллоквиум',
  SportStandarts: 'Сдача спортивных нармативов',
  PracticalWork: 'Практическая работа',
  '': 'Не указано'
}

export type MarkKeys = 'Five' | 'Four' | 'Three' | 'Two' | 'Success' | ''

export const Grade: Record<MarkKeys, AdditionalMarks | number> = {
  Five: 5,
  Four: 4,
  Three: 3,
  Two: 2,
  Success: 'Зч',
  '': 'Д' // Empty grade as 'Д'
} as const

export const LessonType: Record<LessonTypeKeys, string> = {
  Lecture: 'Лекция',
  Lesson: 'Урок',
  PracticalWork: 'Практ. работа',
  PracticalTraining: 'Практ. занятие',
  Seminar: 'Семинар',
  Practice: 'Практика',
  Laboratory: 'Лаб. занятие',
  Self: 'Сам. работа',
  Consultation: 'Консультация',
  Excursion: 'Экскурсия',
  Examination: 'Контр. работа',
  Composition: 'Сочинение',
  BusinessGame: 'Деловая игра',
  SportStandarts: 'Сдача спорт. нормативов',
  '': 'Не указан'
}

export const AbsenceTypes: Record<
  AbsenceTypesKeys,
  AbsenceTypesDescriptionKeys
> = {
  IsAbsent: 'Н',
  IsLate: 'О',
  IsAbsentByNotValidReason: 'НП'
}

export const AbsenceTypesDescription: Record<
  AbsenceTypesDescriptionKeys,
  string
> = {
  Н: 'Отсутствие',
  О: 'Опоздание',
  НП: 'Неуважительное причина'
}

export type TMark = MarkKeys
export type TLesson = keyof typeof LessonWorkType
export type LessonTypes = keyof typeof LessonType
export type AbsenceType = keyof typeof AbsenceTypes

export interface Task {
  attachments: []
  id: number
  isRequired: boolean
  mark: MarkKeys
  topic?: string
  type: TLesson
}

export type Teacher = Person

export interface Classroom {
  building: string
  id: number
  name: string
}

export interface Timetable {
  classroom: Classroom
  teacher?: Teacher
}

export interface Gradebook {
  id: number
  lessonType: LessonTypes
  tasks?: Task[]
  themes?: string[]
  absenceType?: AbsenceType
}

export type Lesson =
  | {
      endTime: string
      startTime: string
    }
  | {
      endTime: string
      startTime: string
      lessonId?: string
      tasks: Task[]
      name: string | null
      timetable: Timetable
      gradebook: Gradebook
    }

export interface Day {
  date: Date | string
  lessons: Lesson[] | null
  isHoliday: boolean
  isShort: boolean
}

export interface IMark {
  subjects: {
    id: number
    mark: TMark
    name: string
  }
}

export interface AuthData {
  cookie: string
  data: UserData
}

export interface DayWithMarks {
  day: Date
  absenceType?: AbsenceType
  markValues: MarkKeys[]
}

export interface DayWithMarksForSubject {
  subjectName: string
  daysWithMarks?: DayWithMarks[]
  averageMark: TMark
}

export interface MonthsWithDays {
  month: {
    num: number
    name: string
  }
  daysWithLessons: Date[]
}

export interface PerformanceCurrent {
  daysWithMarksForSubject: DayWithMarksForSubject[]
  monthsWithDays: MonthsWithDays[]
}

export const Examinations: Record<ExaminationKeys, string> = {
  DifferentiatedTest: 'Дифф. зачёт',
  Test: 'Зачёт',
  Exam: 'Экзамен',
  Other: 'Др. форма контроля'
}

export const TermSubjectExaminations: Record<
  TermSubjectExaminationKeys,
  string
> = {
  profModules: 'Квалиф. экзамены по ПМ',
  subjects: 'Зачёты',
  courseWorks: 'Курсовые работы'
}

// export type ExaminationType = keyof typeof Examinations
export type TermType = 'Semester'

export interface Subject {
  teacher?: Omit<Teacher, 'id'>
  examinationType?: ExaminationKeys
  marks: Record<string, number | string | { value: MarkKeys }>
  name: string
  id: number
}

export interface AttestationResponse {
  termType: TermType
  termNumber: number
  year?: number
  students?: Person[]
  subjects: Subject[]
  profModules?: Subject[]
  courseWorks?: Subject[]
  departmentName: string
}

export interface NotificationsResponse {
  id: number
  attachments: []
  date: Date
  title: string
  text: string
  isForEmployees: boolean
  isForStudents: boolean
  isForParents: boolean
  shouldDeleteNews: boolean
  deleteInDays: number
}

export interface AttestationMark {
  value?: MarkKeys
}

export type AttestationTerm = {
  isActive: boolean
  number: number
  id: number
}

export interface AttestationSubject extends Omit<Subject, 'marks'> {
  finalMark: AttestationMark
  marks: Record<number, { value?: MarkKeys }>
}

export interface AcademicYear {
  id: number
  termType: TermType
  terms: AttestationTerm[]
  number: number
  marks?: AttestationMark
}

/** Ответ от database/students/<id>/attestation **/
export interface AcademicRecord {
  academicYears: AcademicYear[]
  subjects: AttestationSubject[]
}
