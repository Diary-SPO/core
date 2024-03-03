import { AttestationTerm } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { IAcademicYearModel } from 'src/models/AcademicYear'
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
  }).then((v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    result.isActive = term.isActive
    return result.save()
  })
