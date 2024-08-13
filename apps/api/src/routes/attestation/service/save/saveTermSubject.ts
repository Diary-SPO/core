import type { MarkKeys, Subject } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { saveOrGetExaminationType } from '../../../../models/Examination'
import { markValueSaveOrGet } from '../../../../models/MarkValue'
import { subjectSaveOrGet } from '../../../../models/Subject'
import { teacherSaveOrGet } from '../../../../models/Teacher'
import { termSubjectSaveOrGet } from '../../../../models/TermSubject'

export const saveTermSubject = async (
  termSubjectExaminationTypeId: number | undefined,
  currTermId: bigint,
  subjectSave: Subject,
  authData: ICacheData
) => {
  const examinationType = subjectSave.examinationType
  const teacher = subjectSave.teacher
  const name = subjectSave.name
  const id = subjectSave.id
  let markValue = undefined

  // Если есть оценка, то берём
  for (const mark of Object.keys(subjectSave.marks)) {
    const value = subjectSave.marks[mark]
    if (typeof value === 'object') {
      markValue = value.value as MarkKeys
      break
    }
  }

  // Подготавливаем поля для вноса
  const examinationTypeFromDB = examinationType
    ? await retriesForError(saveOrGetExaminationType, [examinationType])
    : undefined
  const teacherFromDB = teacher
    ? await retriesForError(teacherSaveOrGet, [
        { ...teacher, spoId: authData.spoId }
      ])
    : undefined
  const subjectFromDB = await retriesForError(subjectSaveOrGet, [name])
  const markValueFromDB = markValue
    ? await retriesForError(markValueSaveOrGet, [markValue])
    : undefined

  const subject = {
    termId: currTermId,
    subjectId: subjectFromDB.id,
    diaryUserId: authData.localUserId,
    markValueId: markValueFromDB?.id,
    teacherId: teacherFromDB?.id,
    examinationTypeId: examinationTypeFromDB?.id,
    termSubjectExaminationTypeId: termSubjectExaminationTypeId,
    idFromDiary: id
  }

  retriesForError(termSubjectSaveOrGet, [subject])
}
