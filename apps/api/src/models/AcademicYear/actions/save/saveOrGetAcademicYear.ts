import type { AcademicYear } from '@diary-spo/shared'
import { type ICacheData, objPropertyCopy, retriesForError } from '@helpers'
import { saveOrGetTerm, saveOrGetTermType } from '@models'
import { AcademicYearModel } from '@models'

export const saveOrGetAcademicYear = async (
  academicYear: AcademicYear,
  authData: ICacheData
) => {
  const termTypeId = (await saveOrGetTermType(academicYear.termType)).id
  const idFromDiary = academicYear.id
  const number = academicYear.number

  const groupId = authData.groupId

  const defaults = {
    termTypeId,
    number,
    groupId,
    idFromDiary
  }

  const findFunc = () =>
    AcademicYearModel.findOrCreate({
      where: {
        groupId,
        idFromDiary
      },
      defaults
    })

  // Пытаемся найти. Если ошибка, пробуем в последний раз
  const [record, isCreated] = await retriesForError(findFunc, [], 2)

  // Сохраняем семестры для текщего года
  for (const term of academicYear.terms) {
    const saveFunc = () => saveOrGetTerm(term, record, authData)
    const promise = retriesForError(saveFunc, [], 2)

    // Если это активный семестр, то нам обязательно нужно дождаться
    // его записи в базу. А остальные пусть не задерживают.
    if (term.isActive) {
      await promise
    }
  }

  // Если запись уже была, то обновляем.
  // Save() сам определит, были ли изменения и решит,
  // делать ли запрос.
  if (!isCreated) {
    objPropertyCopy(record, defaults)
    return record.save()
  }

  return record
}
