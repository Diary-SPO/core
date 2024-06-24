import type { AttestationResponse } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { type IAttestationResponseRaw, structurizeResponse } from '../'
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
} from '../../../../models'

export const getAttestationFromDB = async (
  authData: ICacheData
): Promise<AttestationResponse | null> => {
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

  // fixme
  return structurizeResponse(dataFromDB, authData)
}
