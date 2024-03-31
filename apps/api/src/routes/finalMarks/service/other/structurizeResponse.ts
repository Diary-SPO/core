import {
  type AcademicYear,
  type AttestationMark,
  type AttestationSubject,
  type AttestationTerm,
  type TermType
} from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import type { RawFinalMarksFromDB } from '../type'

export const structurizeResponse = async (
  raw: RawFinalMarksFromDB,
  authData: ICacheData
) => {
  const academicYears: AcademicYear[] = []
  const subjects: AttestationSubject[] = []

  for (const academicYearRaw of raw.subjectMarks) {
    const terms: AttestationTerm[] = []

    for (const term of academicYearRaw.terms) {
      terms.push({
        id: term.idFromDiary,
        number: term.number,
        isActive: term.isActive
      })

      for (const sub of term.termSubjects) {
        let subject: AttestationSubject | null = null
        let isAdded = false

        // Ищем, добавлен ли уже предмет
        for (const s of subjects) {
          if (s.name === sub.subject.name) {
            subject = s
            isAdded = true
            break
          }
        }

        if (!subject) {
          const id = sub.idFromDiary ?? 0
          const name = sub.subject.name
          const marks: any = new Object()
          let finalMark: AttestationMark = {}

          for (const RawFinalMark of raw.finalMarks) {
            if (RawFinalMark.subjectId === sub.subjectId) {
              const mark = RawFinalMark?.markValue?.value
              if (mark) {
                finalMark = {
                  value: mark
                }
              }
              break
            }
          }

          subject = {
            id,
            name,
            marks,
            finalMark
          }
        }

        subject.marks[term.idFromDiary] = sub?.markValue?.value
          ? {
              value: sub.markValue.value
            }
          : {}

        if (!isAdded) {
          subjects.push(subject)
        }
      }
    }

    terms.sort((a, b) => a.number - b.number)

    const academicYear: AcademicYear = {
      id: academicYearRaw.idFromDiary,
      termType: academicYearRaw.termType.name as TermType,
      number: academicYearRaw.number,
      terms
    }

    academicYears.push(academicYear)
  }

  academicYears.sort((a, b) => a.number - b.number)
  subjects.sort((a, b) => (a.name > b.name ? 1 : -1))

  return {
    academicYears,
    subjects
  }
}
