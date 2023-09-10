// Эти данные приходят с бэка сетевого города, типизация актуальна на момент 04.09.23
// В некоторых местах типизация может быть не полной
export interface Organization {
  // Example: 'spo'
  'organizationType': string,
  'name': string,
  'shortName': string,
  'abbreviation': string,
  'legalStatus': string,
  'address': {
    'region': string,
    // Example: 'г. Томск'
    'settlement': string,
    'mailAddress': string,
    // Example: '70000001000000000'
    'kladr': string
  },
  'organizationDeptId': 1,
  'phone': string,
  'fax': string,
  'email': string,
  'site': string,
  'directorName': string,
  'directorPosition': string,
  // Example: ''
  'studyUnitNumber': string,
  // Example: 'Function'
  'organizationStatus': string,
  'isEntrepreneurOwned': boolean,
  // Example: ''
  'entrepreneurName': string,
  // Example: '4e97a34f-b553-42ec-8c26-bc30332d0661'
  'organizationId': string,
  // Example: ''
  'headOrganizationName': string,
  'isSubdepartment': boolean,
  // Example: ''
  'additionalName': string,
  'type': string,
  'legalAddress': string,
  'actualAddress': string,
  'bankingDetails': {
    'okved': string,
    'inn': string,
    'kpp': string,
    'ogrn': string,
    'oktmo': string,
    'okopth': string,
    'okths': string,
    'okpo': string,
    'others': string,
    'okogu': string,
    'founderType': string,
    // Example: ''
    'founders': string,
    'okato': string
  },
  'administration': {
    'eService': {
      'isEnabled': true,
      'cacheEnrolleeListTimeout': number,
      'cacheSpecialtyListTimeout': number,
      'cacheEnrolleeTimeout': number,
      'useRestIntegration': true
    },
    // Example: 4e97a34f-b553-42ec-8c26-bc30332d0661
    'organizationId': string,
    'attestation': {
      'isEnabled': boolean
    },
    'factHours': {
      'isEnabled': boolean
    },
    'vkChats': {
      'communityId': string,
      'communityToken': string
    }
  }
}

interface UserData {
  installName: string
  localNetwork: boolean
  tenantName: string
  tenants: {
    SPO_23: {
      students: [
        {
          groupId: number,
          groupName: string,
          firstName: string,
          lastName: string,
          middleName: string,
          id: number
        }
      ],
      firstName: string
      isTrusted: boolean
      lastName: string
      middleName: string
      studentRole: {
        id: number
        studentGroupId: number
      },
      settings: {
        organization: Organization
      },
    }
  }
}

export enum LessonType {
  'Lesson' = 'Ответ на занятии',
  'Control' = 'Контрольная работа',
  'Independent' = 'Самостоятельная работа',
  'Laboratory' = 'Лабораторная работа',
  'Slice' = 'Срезовая работа',
  'Home' = 'Домашнее задание',
  'Test' = 'Тест',
  'Review' = 'Реферат',
  'Report' = 'Доклад',
  'Colloquium' = 'Коллоквиум',
  'SportStandarts' = 'Сдача спортивных нармативов',
  'PracticeWork' = 'Практическая работа',
  '' = 'Не указано'
}

// FIXME: enum стал страшный и в целом enum многие по понятным причинам хейтят
// Поэтому когда-нибудь надо пофиксить
export enum Grade {
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
  One = 1,
  // Оценка пустая = долг, двойку не ставим!
  '' = 'Д',
  'Н' = 'Н',
  // Кастыль :))
  'Д' = 'Д',
  'ДЗ' = 'ДЗ',
  'О' = 'О'
}

export enum LessonWorkType {
  'Lecture' = 'Лекция',
  'PracticalWork' = 'Практ. работа',
  'PracticalTraining' = 'Практ. занятие',
  'Seminar' = 'Семинар',
  '' = 'Не указан'
}

export enum EAbsenceTypes {
  'IsAbsent' = 'Н',
  'IsLate' = 'О',
}

export enum EAbsenceTypesDescription {
  'Н' = 'Отсутствие',
  'О' = 'Опоздание',
}

type GradeKeys = keyof typeof Grade;

export type TextMark = GradeKeys;
export type TMark = typeof Grade[GradeKeys];
export type TLesson = keyof typeof LessonWorkType;
export type LessonTypes = keyof typeof LessonType;
export type AbsenceType = keyof typeof EAbsenceTypes;

export interface Task {
  attachments: []
  id: number
  isRequired: boolean
  mark: TextMark
  topic?: string
  type: LessonTypes
}

interface Teacher {
  firstName: string
  id: number
  lastName: string
  middleName: string
}

export interface Timetable {
  classroom: {
    building: string
    id: number
    name: string
  },
  teacher: Teacher
}

export interface Gradebook {
  id: number
  lessonType: TLesson
  tasks?: Task[]
  themes?: string[]
  // TODO: возможно есть другие значения
  absenceType?: AbsenceType
}

export interface Lesson {
  lessonId?: string
  endTime: string
  startTime: string
  name: string | null
  timetable: Timetable
  gradebook?: Gradebook,
  tasks?: Task[],
}

export interface Day {
  date: Date;
  lessons: Lesson[] | null
}

export interface IMark {
  subjects: {
    id: number
    mark: TMark
    name: string
  }[]
}

export interface AuthData {
  cookie: string
  data: UserData
}

export interface PerformanceCurrent {
  daysWithMarksForSubject: [{
    subjectName: string;
    daysWithMarks?: [
      {
        day: Date;
        absenceType?: AbsenceType;
        markValues: TextMark[];
      }
    ];
    averageMark: TMark;
  }],
  monthsWithDays: [
    {
      month: {
        num: number,
        name: string
      },
      daysWithLessons: [Date]
    }
  ],
}
export enum Examinations {
  'DifferentiatedTest'= 'Дифф. зачёт',
  'Test'= 'Зачёт',
  'Exam'= 'Экзамен',
  'Other'= 'Др. форма контроля',
}

export type ExaminationType = keyof typeof Examinations;
export type TermType = 'Semester';

export interface AttestationResponse {
  termType: TermType;
  termNumber: number;
  year: number;
  students: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
  }[];
  subjects: {
    examinationType: ExaminationType;
    marks: Record<string, number>;
    name: string;
    id: number;
  }[];
  profModules: unknown[];
  courseWorks: unknown[];
  departmentName: string;
}

