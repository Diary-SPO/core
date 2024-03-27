import { AttestationResponse } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { detectTerm } from '@models'
import { saveTermSubjects } from './saveTermSubjects'
import { saveYear } from 'src/models/AcademicYear/actions/saveYear'

export const saveAttestation = async (
  data: AttestationResponse,
  authData: ICacheData
) => {
  const currTermId = await detectTerm(authData)

  if (!currTermId) {
    return null
  }

  const subjects = data.subjects
  const profModules = data.profModules
  const courseWorks = data.courseWorks

  // Сохраняем год
  const year = data?.year
  saveYear(year, currTermId).catch(() => console.log("Ошибка сохранения года"))

  // Вызываем сохранение

  saveTermSubjects('subjects', currTermId, subjects, authData)

  if (profModules) {
    saveTermSubjects('profModules', currTermId, profModules, authData)
  }

  if (courseWorks) {
    saveTermSubjects('courseWorks', currTermId, courseWorks, authData)
  }
}
