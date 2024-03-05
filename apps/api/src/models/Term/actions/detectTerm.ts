import { API_CODES, API_ERRORS, ApiError } from '@api'
import { AcademicRecord } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { DiaryUserModel, findActiveTerm } from '@models'
import { formatDate } from '@utils'
import { saveOrGetAcademicYear } from 'src/models/AcademicYear/actions'
import { getFinalMarksFromDiary } from 'src/routes/finalMarks/service'

/**
 * Обновляет (если нужно) текущий семестр и отдаёт его
 * @param attestation
 * @param authData
 */
export const detectTerm = async (
  authData: ICacheData,
  attestation?: AcademicRecord
) => {
  const currDate = formatDate(new Date().toISOString())
  // Если данные уже актуальны, то просто ищем и отдаём
  if (
    authData.termLastUpdate &&
    formatDate(new Date(authData.termLastUpdate).toISOString()) === currDate
  ) {
    // TODO: если студент отучится и у него не будет
    // активного семестра, будет ошибка. Нужно поправить :)
    return findActiveTerm(authData)
  }

  // Если аттестация не передана, то запрашиваем сами
  if (!attestation) {
    attestation = await getFinalMarksFromDiary(authData)
  }

  if (!attestation) {
    throw new ApiError(
      API_ERRORS.DATA_NOT_FOUND,
      API_CODES.INTERNAL_SERVER_ERROR
    )
  }

  // Сохраняем данные
  const promises = []

  // Сохраняем каждый год
  for (const year of attestation.academicYears) {
    promises.push(saveOrGetAcademicYear(year, authData))
  }

  // Ждём завершения всех промисов
  await Promise.all(promises).then(async () => {
    // Если все завершились успешно - обновляем у
    // пользователя дату последнего извелечения
    await DiaryUserModel.update(
      {
        termLastDateUpdate: currDate
      },
      {
        where: {
          id: authData.localUserId
        }
      }
    )
  })

  return findActiveTerm(authData)
}
