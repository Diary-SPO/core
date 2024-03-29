import { ExaminationKeys, Subject } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { TeacherModelType } from '@models'
import { IAttestationResponseRaw } from '../'

export const structurizeResponse = async (
  data: IAttestationResponseRaw | null,
  authData: ICacheData
) => {
  if (!data || data.terms.length === 0) {
    return null
  }
  const term = data.terms[0]
  /* Поля для выдачи */
  const termType = data.termType.name
  const termNumber = term.number
  const year = data?.year || new Date().getFullYear()
  const departmentName = ''
  const students = [formatPerson(authData)]

  const subjects = getAllByName(data, 'subjects', authData)
  const profModules = getAllByName(data, 'profModules', authData)
  const courseWorks = getAllByName(data, 'courseWorks', authData)

  return {
    termType,
    termNumber,
    year,
    students,
    subjects,
    profModules,
    courseWorks,
    departmentName
  }
}

function getAllByName(
  raw: IAttestationResponseRaw,
  type: string,
  authData: ICacheData
) {
  const sort: Subject[] = []
  for (const term of raw.terms) {
    for (const subject of term.termSubjects) {
      if (subject.termSubjectExaminationType.name === type) {
        const teacher = subject?.teacher
        const examinationType = subject.examinationType?.name as ExaminationKeys
        const marks = Object()
        marks[authData.idFromDiary] = { value: subject.markValue?.value }
        const name = subject.subject.name
        const id = subject.idFromDiary ?? 0

        const formatTeacher = teacher ? formatPerson(teacher) : undefined

        sort.push({
          teacher: formatTeacher,
          examinationType,
          marks,
          name,
          id
        })
      }
    }
  }
  return sort
}

function formatPerson(person: TeacherModelType | ICacheData) {
  return {
    firstName: person.firstName,
    lastName: person.lastName,
    middleName: person.middleName,
    id: person.idFromDiary
  }
}
