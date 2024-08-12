import type { Subject, TermSubjectExaminationKeys } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { saveOrGetTermSubjectExaminationType } from '../../../../models/TermSubjectExaminationType'
import { saveTermSubject } from './saveTermSubject'

export const saveTermSubjects = async (
  type: TermSubjectExaminationKeys,
  currTermId: bigint,
  subjectsSave: Subject[],
  authData: ICacheData
) => {
  // subjects, profModules, courseWorks и прочее
  const termSubjectExaminationType = await retriesForError(
    saveOrGetTermSubjectExaminationType,
    [type]
  )

  for (const subjectSave of subjectsSave ?? []) {
    saveTermSubject(
      termSubjectExaminationType?.id,
      currTermId,
      subjectSave,
      authData
    )
  }
}
