import type { AcademicRecord } from '@diary-spo/shared'
import type { SubjectMatrix } from '../../types.ts'

export const mockData: AcademicRecord = {
  academicYears: [
    {
      id: 1,
      termType: 'Semester',
      terms: [
        { isActive: true, number: 1, id: 101 },
        { isActive: true, number: 2, id: 102 }
      ],
      number: 2023
    },
    {
      id: 2,
      termType: 'Semester',
      terms: [
        { isActive: true, number: 1, id: 103 },
        { isActive: true, number: 2, id: 104 }
      ],
      number: 2024
    }
  ],
  subjects: [
    {
      id: 101,
      name: 'Subject 1',
      finalMark: { value: 'Five' },
      marks: { 101: { value: 'Four' }, 102: { value: 'Three' } }
    },
    {
      id: 102,
      name: 'Subject 2',
      finalMark: { value: 'Three' },
      marks: { 103: { value: 'Two' }, 104: { value: 'Four' } }
    }
  ]
}

export const expectedMatrix: SubjectMatrix = [
  {
    subjectName: 'Subject 1',
    finalMark: 5,
    terms: [
      { course: 2023, semester: 1, mark: 4 },
      { course: 2023, semester: 2, mark: 3 },
      { course: 2024, semester: 1, mark: '' },
      { course: 2024, semester: 2, mark: '' }
    ]
  },
  {
    subjectName: 'Subject 2',
    finalMark: 3,
    terms: [
      { course: 2023, semester: 1, mark: '' },
      { course: 2023, semester: 2, mark: '' },
      { course: 2024, semester: 1, mark: 2 },
      { course: 2024, semester: 2, mark: 4 }
    ]
  }
]
