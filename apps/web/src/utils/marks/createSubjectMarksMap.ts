import { AbsenceType, PerformanceCurrent, TMark } from '@diary-spo/shared'

export interface SubjectMarksItem {
  date: string
  marks: TMark[]
  absenceType?: AbsenceType
}

export type SubjectMarksMatrix = Array<{
  subjectName: string
  data: Array<SubjectMarksItem>
}>

export const createSubjectMarksMatrix = (
  marksForSubject: PerformanceCurrent
): SubjectMarksMatrix => {
  const subjectMarksMatrix: SubjectMarksMatrix = []

  for (const subject of marksForSubject.daysWithMarksForSubject) {
    const { subjectName, daysWithMarks } = subject

    subjectMarksMatrix.push({
      subjectName,
      data: []
    })

    for (const dayWithMark of Object.values(daysWithMarks)) {
      subjectMarksMatrix
        .find((subject) => subject.subjectName === subjectName)
        .data.push({
          date: new Date(dayWithMark.day).toLocaleDateString('ru-RU'),
          marks: dayWithMark.markValues,
          absenceType: dayWithMark.absenceType
        })
    }
  }

  return subjectMarksMatrix
}
