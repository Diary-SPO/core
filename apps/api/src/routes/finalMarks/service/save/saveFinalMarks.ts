import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import {
  type ITermSubjectModel,
  TermSubjectModel,
  markValueSaveOrGet,
  saveOrGetFinalMark,
  saveOrGetTerm,
  subjectSaveOrGet,
  termSubjectSaveOrGet
} from '@models'
import { Op } from 'sequelize'
import { saveOrGetAcademicYear } from 'src/models/AcademicYear/actions'

export const saveFinalMarks = async (
  finalMarks: AcademicRecord,
  authData: ICacheData
) => {
  const promises: Promise<ITermSubjectModel>[] = []
  const notDeleted: ITermSubjectModel[] = []

  finalMarks.subjects.forEach(async (subject) => {
    const finalMark = subject.finalMark?.value
    const name = subject.name
    const marks = subject.marks

    const subjectFromDB = await subjectSaveOrGet(name)
    let yearFromDB = null

    // Сохраняем промежуточные оценки
    for (const semId of Object.keys(marks)) {
      const semesterIdFromDiary = Number(semId)
      const mark = marks[semesterIdFromDiary]?.value

      const searchAcademicYear = searchAcademicAndSemesterById(
        semesterIdFromDiary,
        finalMarks
      )
      if (!searchAcademicYear) continue

      const { year, term } = searchAcademicYear

      // Уменьшаем количество запросов примерно на 12 шт.
      if (!yearFromDB || yearFromDB.idFromDiary !== year.id) {
        yearFromDB = await saveOrGetAcademicYear(year, authData)
      }
      const termFromDB = await saveOrGetTerm(term, yearFromDB, authData)
      const idMarkFromDB = mark
        ? (await markValueSaveOrGet(mark)).id
        : undefined

      // Сохраняем промежуточную оценку
      const promise = termSubjectSaveOrGet({
        termId: termFromDB.id,
        subjectId: subjectFromDB.id,
        diaryUserId: authData.localUserId,
        markValueId: idMarkFromDB
      }).then((r) => {
        const [raw, isCreated] = r
        notDeleted.push(raw)
        if (isCreated) return raw
        raw.markValueId = idMarkFromDB
        return raw.save()
      })
      promises.push(promise)
    }

    // Сохраняем итоговые оценки
    const idMarkFromDB = finalMark
      ? (await markValueSaveOrGet(finalMark)).id
      : undefined
    saveOrGetFinalMark(idMarkFromDB ?? null, subjectFromDB.id, authData)
  })

  await Promise.all(promises)
  deleteNotIn(notDeleted, authData)
}

function searchAcademicAndSemesterById(
  idFromDiary: number,
  finalMarks: AcademicRecord
) {
  for (const year of finalMarks.academicYears) {
    for (const term of year.terms) {
      if (term.id === idFromDiary) {
        return { year, term }
      }
    }
  }
  return null
}

async function deleteNotIn(
  notDeleted: ITermSubjectModel[],
  authData: ICacheData
) {
  const where = []
  for (const raw of notDeleted) {
    const { termId, subjectId, markValueId } = raw
    where.push({
      termId: {
        [Op.ne]: termId
      },
      subjectId: {
        [Op.ne]: subjectId
      },
      markValueId: {
        [Op.ne]: markValueId
      }
    })
  }
  if (where.length > 0) {
    TermSubjectModel.destroy({
      where: {
        [Op.and]: [
          ...where,
          {
            diaryUserId: authData.localUserId
          }
        ]
      }
    })
  }
}
