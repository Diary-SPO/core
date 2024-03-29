import { AcademicRecord, MarkKeys } from "@diary-spo/shared";
import { ICacheData } from "@helpers";
import { markValueSaveOrGet, saveOrGetFinalMark, saveOrGetTerm, subjectSaveOrGet, termSubjectSaveOrGet } from "@models";
import { saveOrGetAcademicYear } from "src/models/AcademicYear/actions";

export const saveFinalMarks = async (finalMarks: AcademicRecord, authData: ICacheData) => {
  for (const subject of finalMarks.subjects) {
    const finalMark = subject.finalMark?.value
    const name = subject.name
    const marks = subject.marks

    const subjectFromDB = await subjectSaveOrGet(name)

    // Сохраняем промежуточные оценки
    for (const semId of Object.keys(marks)) {
      const semesterIdFromDiary = Number(semId)
      const mark = marks[semesterIdFromDiary]?.value

      const searchAcademicYear = searchAcademicAndSemesterById(semesterIdFromDiary, finalMarks)
      if (!searchAcademicYear) continue

      const {year, term} = searchAcademicYear

      const yearFromDB = await saveOrGetAcademicYear(year, authData)
      const termFromDB = await saveOrGetTerm(term, yearFromDB, authData)
      const idMarkFromDB = mark ? (await markValueSaveOrGet(mark)).id : undefined

      // Сохраняем промежуточную оценку
      termSubjectSaveOrGet({
        termId: termFromDB.id,
        subjectId: subjectFromDB.id,
        diaryUserId: authData.localUserId,
        markValueId: idMarkFromDB
      }).then((r) => {
        const [raw, isCreated] = r
        if (isCreated) return raw
        raw.markValueId = idMarkFromDB
        return raw.save()
      })
    }

    // Сохраняем итоговые оценки
    const idMarkFromDB = finalMark ? (await markValueSaveOrGet(finalMark)).id : undefined
    saveOrGetFinalMark(idMarkFromDB ?? null, subjectFromDB.id, authData)
  }
}

function searchAcademicAndSemesterById(idFromDiary: number, finalMarks: AcademicRecord) {
  for (const year of finalMarks.academicYears) {
    for (const term of year.terms) {
      if (term.id === idFromDiary) {
        return {year, term}
      }
    }
  }
  return null
}