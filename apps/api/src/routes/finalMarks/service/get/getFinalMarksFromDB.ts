import type { ICacheData } from '@helpers'

import { AcademicYearModel } from '../../../../models/AcademicYear'
import { FinalMarkModel } from '../../../../models/FinalMark'
import { MarkValueModel } from '../../../../models/MarkValue'
import { SubjectModel } from '../../../../models/Subject'
import { TermModel } from '../../../../models/Term'
import { TermSubjectModel } from '../../../../models/TermSubject'
import { TermTypeModel } from '../../../../models/TermType'
import type { RawFinalMark, RawFinalMarksFromDB, RawSubjectMark } from '../type'

export const getFinalMarksFromDB = async (
  authData: ICacheData
): Promise<RawFinalMarksFromDB> => {
  const subjectMarks = AcademicYearModel.findAll({
    include: [
      {
        model: TermModel,
        include: [
          {
            model: TermSubjectModel,
            include: [
              SubjectModel,
              {
                model: MarkValueModel,
                required: false
              }
            ],
            where: {
              diaryUserId: authData.localUserId
            },
            required: false
          }
        ]
      },
      TermTypeModel
    ],
    where: {
      groupId: authData.groupId
    }
  })

  const finalMarks = FinalMarkModel.findAll({
    where: {
      diaryUserId: authData.localUserId
    },
    include: [
      SubjectModel,
      {
        model: MarkValueModel,
        required: false
      }
    ]
  })

  // fixme
  return {
    subjectMarks: (await subjectMarks) as RawSubjectMark[],
    finalMarks: (await finalMarks) as RawFinalMark[]
  }
}
