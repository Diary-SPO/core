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
      "settings": {
        "organization": Organization
      },
    }
  }
}

export type TextMarks = 'Five' | 'Four' | 'Three' | 'Two' | 'One' | '';

interface Task {
  attachments:[]
  id: number
  isRequired: boolean
  mark: TextMarks
  topic: string
  type: 'Lesson'
}

interface Teacher {
  firstName: string
  id: number
  lastName: string
  middleName: string
}

interface Timetable {
  classroom: {
    building: string
    id: number
    name: string
  },
  teacher?: Teacher
}

export interface Lesson {
  endTime: Date
  startTime: Date
  name: string | null
  timetable: Timetable
  gradebook?: {
    id: number
    lessonType: 'Lecture'
    tasks: Task[]
    themes: []
  }
}
export interface Day {
  date: Date;
  lessons: Lesson[] | null
}

export type TMarks = 1 | 2 | 3 | 4 | 5;

export interface IMark {
  subjects: {
    id: number
    mark: TMarks
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
        markValues: TextMarks[];
      }
    ];
    averageMark: TMarks;
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

