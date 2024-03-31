import type { AttestationResponse, Nullable, Subject } from '@diary-spo/shared'

// TODO: add tests
export const processAttestationData = (data: Nullable<AttestationResponse>) => {
  if (!data) {
    return
  }

  const student = data?.students[0]

  const semesters: Record<string, Subject[]> = {}
  const studentName = `${student.lastName} ${student.firstName.slice(
    0,
    1
  )}. ${student.middleName.slice(0, 1)}.`
  const year = data.year

  const semesterKey = `Семестр ${data.termNumber}`

  if (!semesters[semesterKey]) {
    semesters[semesterKey] = []
  }

  for (const subject of data.subjects) {
    semesters[semesterKey].push(subject)
  }

  return { semesters, studentName, year }
}
