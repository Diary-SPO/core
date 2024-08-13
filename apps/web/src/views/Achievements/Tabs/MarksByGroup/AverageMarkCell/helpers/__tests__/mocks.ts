import type { PerformanceCurrent } from '@diary-spo/shared'
import type { SubjectMarksMatrix } from '@utils'

/** createSubjectMarksMatrix */

export const mockData: PerformanceCurrent = {
  monthsWithDays: [
    { daysWithLessons: [undefined], month: { name: '', num: 0 } }
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'МДК 01.01',
      daysWithMarks: [
        {
          day: new Date(),
          markValues: ['Five', 'Four'],
          absenceType: undefined
        }
      ],
      averageMark: 'Four'
    }
  ]
}

export const mockDataWithoutMarks: PerformanceCurrent = {
  monthsWithDays: [
    { daysWithLessons: [undefined], month: { name: '', num: 0 } }
  ],
  daysWithMarksForSubject: [
    {
      subjectName: 'МДК 01.01',
      daysWithMarks: [
        {
          day: new Date(),
          markValues: [],
          absenceType: undefined
        }
      ],
      averageMark: 'Four'
    }
  ]
}

export const expectedMapDataWithoutMarks: SubjectMarksMatrix = [
  {
    data: [
      {
        absenceType: undefined,
        date: new Date().toLocaleDateString('ru'),
        marks: []
      }
    ],
    subjectName: 'МДК 01.01'
  }
]

export const expectedMapData: SubjectMarksMatrix = [
  {
    data: [
      {
        absenceType: undefined,
        date: new Date().toLocaleDateString('ru'),
        marks: ['Five', 'Four']
      }
    ],
    subjectName: 'МДК 01.01'
  }
]
