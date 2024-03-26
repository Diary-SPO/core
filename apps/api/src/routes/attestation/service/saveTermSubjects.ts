import { Subject, TermSubjectExaminationKeys } from "@diary-spo/shared";
import { ICacheData, retriesForError } from "@helpers";
import { saveOrGetTermSubjectExaminationType } from "src/models/TermSubjectExaminationType/actions/saveOrGetTermSubjectExaminationType";
import { saveTermSubject } from "./saveTermSubject";

export const saveTermSubjects = async (
  type: TermSubjectExaminationKeys,
  currTermId: number,
  subjectsSave: Subject[],
  authData: ICacheData
) => {
  // subjects, profModules, courseWorks и прочее
  const termSubjectExaminationType = await retriesForError(
    saveOrGetTermSubjectExaminationType,
    [type]
  );

  for (const subjectSave of subjectsSave) {
    saveTermSubject(termSubjectExaminationType?.id, currTermId, subjectSave, authData)
  }
};
