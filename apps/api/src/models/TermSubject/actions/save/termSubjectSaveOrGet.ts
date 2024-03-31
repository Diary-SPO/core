import { objPropertyCopy } from '@helpers'
import { TermSubjectModel } from '../../model'

type IArgument = {
  termId: bigint
  subjectId: bigint
  diaryUserId: bigint
  markValueId?: number
  teacherId?: bigint
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
      return raw
    }
    objPropertyCopy(raw, subject)
    return raw.save()
  })
}
