import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { Op } from 'sequelize'
import { saveOrGetAcademicYear } from 'src/models/AcademicYear/actions'
import { saveOrGetFinalMark } from '../../../../models/FinalMark'
import { markValueSaveOrGet } from '../../../../models/MarkValue'
import { subjectSaveOrGet } from '../../../../models/Subject'
import { saveOrGetTerm } from '../../../../models/Term'
import {
  type ITermSubjectModel,
  TermSubjectModel,
  termSubjectSaveOrGet
} from '../../../../models/TermSubject'

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
      }).then((raw) => {
        notDeleted.push(raw)
        if (raw.markValueId !== idMarkFromDB) {
          raw.markValueId = idMarkFromDB
        }
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
  if (where.length) {
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
