import type { AttestationResponse } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { type IAttestationResponseRaw, structurizeResponse } from '../'
import { AcademicYearModel } from '../../../../models/AcademicYear'
import { ExaminationTypeModel } from '../../../../models/Examination'
import { MarkValueModel } from '../../../../models/MarkValue'
import { SubjectModel } from '../../../../models/Subject'
import { TeacherModel } from '../../../../models/Teacher'
import { TermModel, detectTerm } from '../../../../models/Term'
import { TermSubjectModel } from '../../../../models/TermSubject'
import { TermSubjectExaminationTypeModel } from '../../../../models/TermSubjectExaminationType'
import { TermTypeModel } from '../../../../models/TermType'

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
