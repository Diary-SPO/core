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
import { IAttestationResponseRaw, structurizeResponse } from '../'
import { AttestationResponse } from '@diary-spo/shared'

export const getAttestationFromDB = async (
  authData: ICacheData
): Promise<string | AttestationResponse> => {
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
