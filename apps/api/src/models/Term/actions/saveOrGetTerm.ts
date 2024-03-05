import { AttestationTerm } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { IAcademicYearModel } from 'src/models/AcademicYear'
import { saveOrGetTermUser } from 'src/models/TermUser'
import { TermModel } from '../model'

export const saveOrGetTerm = async (
  term: AttestationTerm,
  year: IAcademicYearModel,
  authData: ICacheData
) =>
  TermModel.findOrCreate({
    where: {
      academicYearId: year.id,
      number: term.number,
      idFromDiary: term.id
    },
    defaults: {
      idFromDiary: term.id,
      number: term.number,
      isActive: term.isActive,
      academicYearId: year.id
    }
  }).then(async (v) => {
    const result = v[0]
    // Связываем с пользователем
    await saveOrGetTermUser(result.id, authData)
    // Отдаём сам семестр
    if (v[1]) {
      return result
    }
    result.isActive = term.isActive
    return result.save()
  })
