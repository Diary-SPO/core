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
  data: {
    installName: string
    localNetwork: boolean
    tenantName: string
    tenants: {
      SPO_23: {
        firstName: string
        isTrusted: boolean
        lastName: string
        middleName: string
        studentRole: {
          id: number
          studentGroupId: number
        }
        // TODO: Типизировать это потом
      }
    }
  }
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

