// Эти данные приходят с бэка сетевого города, типизация актуальна на момент 04.09.23
// В некоторых местах типизация может быть не полной
interface Organization {
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
  'Lesson' = 'ответ на уроке',
  'Control' = 'контрольная работа',
  'Independent' = 'самостоятельная работа',
  'Laboratory' = 'лабораторная работа',
  'Slice' = 'срезовая работа',
  'Home' = 'домашнее задание',
  'Review' = 'реферат',
  'Test' = 'тест',
  'Report' = 'доклад',
  'Colloquium' = 'коллоквиум',
  'SportStandarts' = 'сдача спортивных нармативов',
  'PracticeWork' = 'практическая работа',
  '' = 'не указано'
}

export enum Grade {
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
  One = 1,
  // Оценка пустая = долг, двойку не ставим!
  '' = 'Д',
}

type GradeKeys = keyof typeof Grade;

export type TextMark = GradeKeys;
export type TMark = typeof Grade[GradeKeys];
export type TLesson = 'Lecture' | 'PracticalWork' | 'PracticalTraining' | '';
export type LessonTypes = keyof typeof LessonType;

export enum LessonWorkType {
  'Lecture' = 'Лекция',
  'PracticalWork' = 'Практ. работа',
  'PracticalTraining' = 'Практ. занятие',
  '' = 'не задан'
}

export interface Task {
  attachments: []
  id: number
  isRequired: boolean
  mark: TextMark
  topic: string
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
}

export interface Lesson {
  endTime: string
  startTime: string
  name: string | null
  timetable: Timetable
  gradebook?: Gradebook,
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
    daysWithMarks: [
      {
        day: Date;
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

