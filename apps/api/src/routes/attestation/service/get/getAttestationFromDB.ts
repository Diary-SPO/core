import type { AttestationResponse } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
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
import { type IAttestationResponseRaw, structurizeResponse } from '../'

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
            },
            required: false
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
