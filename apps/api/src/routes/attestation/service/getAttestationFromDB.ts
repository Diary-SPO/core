import { ICacheData } from '@helpers'
import {
  AcademicYearModel,
  ExaminationTypeModel,
  MarkValueModel,
  SubjectModel,
  TeacherModel,
  TermModel,
  TermSubjectExaminationTypeModel,
  TermSubjectModel,
  TermTypeModel,
  detectTerm
} from '@models'
import { IAttestationResponseRaw } from './type'
import { structurizeResponse } from './structurizeResponse'

export const getAttestationFromDB = async (authData: ICacheData) => {
  const currTermId = await detectTerm(authData)
  const dataFromDB = (await AcademicYearModel.findOne({
    include: [
      {
        model: TermModel,
        include: [
          {
            model: TermSubjectModel,
            include: [
              TermSubjectExaminationTypeModel,
              ExaminationTypeModel,
              TeacherModel,
              MarkValueModel,
              SubjectModel
            ],
            where: {
              diaryUserId: authData.localUserId
            }
          }
        ],
        where: {
          id: currTermId
        }
      },
      {
        model: TermTypeModel
      }
    ]
  })) as IAttestationResponseRaw | null

  return structurizeResponse(dataFromDB, authData)
}
