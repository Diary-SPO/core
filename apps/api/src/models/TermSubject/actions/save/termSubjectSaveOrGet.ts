import { objPropertyCopy } from '@helpers'
import { TermSubjectModel } from '../../model'

type IArgument = {
  termId: number
  subjectId: number
  diaryUserId: number
  markValueId?: number
  teacherId?: number
  examinationTypeId?: number
  termSubjectExaminationTypeId?: number
  idFromDiary?: number
}

export const termSubjectSaveOrGet = async (subject: IArgument) => {
  return TermSubjectModel.findOrCreate({
    where: {
      termId: subject.termId,
      subjectId: subject.subjectId,
      diaryUserId: subject.diaryUserId
    },
    defaults: {
      ...subject
    }
  }).then(async (r) => {
    const [raw, isCreated] = r
    if (isCreated) {
      return r
    }
    objPropertyCopy(raw, subject)
    return [await raw.save(), isCreated]
  })
}
