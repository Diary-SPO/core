import { PerformanceCurrent } from '@diary-spo/shared'
import { SubjectMarksMap } from '@utils'

/** createSubjectMarksMap */

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

export const expectedMapDataWithoutMarks: SubjectMarksMap = {
  'МДК 01.01': [
    {
      date: new Date().toLocaleDateString(),
      marks: [],
      absenceType: undefined
    }
  ]
}

export const expectedMapData: SubjectMarksMap = {
  'МДК 01.01': [
    {
      date: new Date().toLocaleDateString(),
      marks: ['Five', 'Four'],
      absenceType: undefined
    }
  ]
}
