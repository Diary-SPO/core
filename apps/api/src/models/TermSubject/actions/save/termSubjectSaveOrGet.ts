import { Subject } from '@diary-spo/shared'
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
  }).then(() => {
    // TODO: ТУТ СКОПИРОВАТЬ ПОЛЯ
  })
}
