import { PerformanceCurrent } from '@diary-spo/shared'
import { SubjectMarksMatrix } from '@utils'

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
        date: '30/03/2024',
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
        date: '30/03/2024',
        marks: ['Five', 'Four']
      }
    ],
    subjectName: 'МДК 01.01'
  }
]
