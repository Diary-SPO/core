import type { ICacheData } from '@helpers'
import {
  AcademicYearModel,
  FinalMarkModel,
  MarkValueModel,
  SubjectModel,
  TermModel,
  TermSubjectModel,
  TermTypeModel
} from '@models'
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

  return {
    subjectMarks: (await subjectMarks) as RawSubjectMark[],
    finalMarks: (await finalMarks) as RawFinalMark[]
  }
}
