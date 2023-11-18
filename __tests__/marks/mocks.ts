import { PerformanceCurrent } from '@diary-spo/shared'
import { SubjectMarksMap } from '@utils'

/** createSubjectMarksMap */

export const mockData: PerformanceCurrent = {
  monthsWithDays: [
    { daysWithLessons: [undefined], month: { name: '', num: 0 } },
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'МДК 01.01',
      daysWithMarks: [
        {
          day: new Date(),
          markValues: ['Five', 'Four'],
          absenceType: undefined,
        },
      ],
      averageMark: 'Four',
    },
  ],
}

export const mockDataWithoutMarks: PerformanceCurrent = {
  monthsWithDays: [
    { daysWithLessons: [undefined], month: { name: '', num: 0 } },
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'МДК 01.01',
      daysWithMarks: [
        {
          day: new Date(),
          markValues: [],
          absenceType: undefined,
        },
      ],
      averageMark: 'Four',
    },
  ],
}

export const expectedMapDataWithoutMarks: SubjectMarksMap = {
  'МДК 01.01': [
    {
      date: new Date().toLocaleDateString(),
      marks: [],
      absenceType: undefined,
    },
  ],
}

export const expectedMapData: SubjectMarksMap = {
  'МДК 01.01': [
    {
      date: new Date().toLocaleDateString(),
      marks: ['Five', 'Four'],
      absenceType: undefined,
    },
  ],
}

/** extractMarksByDay */

export const performanceMockData: PerformanceCurrent = {
  monthsWithDays: [
    {
      month: {
        name: 'Имя',
        num: 1,
      },
      daysWithLessons: [new Date()],
    },
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'Math',
      daysWithMarks: [
        {
          day: new Date('2023-10-30'),
          markValues: ['Five', 'Four'],
        },
        {
          day: new Date('2023-10-31'),
          markValues: ['Three', 'Two'],
        },
      ],
      averageMark: 0,
    },
    {
      subjectName: 'Science',
      daysWithMarks: [
        {
          day: new Date('2023-10-30'),
          markValues: ['Five', 'Four'],
        },
        {
          day: new Date('2023-10-31'),
          markValues: ['Five', 'Five'],
        },
      ],
      averageMark: 0,
    },
  ],
}

export const expectedExtractByDayData = {
  '30.10.2023': {
    Math: [5, 4],
    Science: [5, 4],
  },
  '31.10.2023': {
    Math: [3, 2],
    Science: [5, 5],
  },
}

export const invalidPerformanceMockData: PerformanceCurrent = {
  monthsWithDays: [
    {
      month: {
        name: 'Имя',
        num: 1,
      },
      daysWithLessons: [new Date()],
    },
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'Math',
      daysWithMarks: [
        {
          day: new Date('2023-10-30'),
          markValues: ['Invalid', 'Five'],
        },
        {
          day: new Date('2023-10-31'),
          markValues: ['Three', 'Unknown'],
        },
      ],
      averageMark: 0,
    },
  ],
}

export const expectedInvalidExtractByDayData = {
  '30.10.2023': {
    Math: [5],
  },
  '31.10.2023': {
    Math: [3],
  },
}
