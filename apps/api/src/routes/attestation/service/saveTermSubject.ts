import { MarkKeys, Subject, TermSubjectExaminationKeys } from "@diary-spo/shared";
import { ICacheData, retriesForError } from "@helpers";
import {
  detectTerm,
  markValueSaveOrGet,
  saveOrGetExaminationType,
  subjectSaveOrGet,
  TeacherSaveOrGet,
  termSubjectSaveOrGet,
} from "@models";
import { saveOrGetTermSubjectExaminationType } from "src/models/TermSubjectExaminationType/actions/saveOrGetTermSubjectExaminationType";

export const saveTermSubject = async (
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
    const examinationType = subjectSave.examinationType;
    const teacher = subjectSave.teacher;
    const name = subjectSave.name;
    const id = subjectSave.id;
    let markValue = undefined;

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
      : undefined;
    const teacherFromDB = teacher
      ? await retriesForError(TeacherSaveOrGet, [
          { ...teacher, spoId: authData.spoId },
        ])
      : undefined;
    const subjectFromDB = await retriesForError(subjectSaveOrGet, [name])
    const markValueFromDB = markValue
      ? await retriesForError(markValueSaveOrGet, [markValue])
      : undefined;

    const subject = {
      termId: currTermId,
      subjectId: subjectFromDB.id,
      diaryUserId: authData.localUserId,
      markValueId: markValueFromDB?.id,
      teacherId: teacherFromDB?.id,
      examinationTypeId: examinationTypeFromDB?.id,
      termSubjectExaminationTypeId: termSubjectExaminationType?.id,
      idFromDiary: id,
    };

    retriesForError(termSubjectSaveOrGet, [subject]);
  }
};
