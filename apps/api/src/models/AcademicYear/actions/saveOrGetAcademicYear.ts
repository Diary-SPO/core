import { AcademicYear } from "@diary-spo/shared";
import { ICacheData, objPropertyCopy } from "@helpers";
import { saveOrGetTerm, saveOrGetTermType } from "@models";
import { AcademicYearModel } from "@models";

export const saveOrGetAcademicYear = async (academicYear: AcademicYear, authData: ICacheData) => {
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

  const [record, isCreated] = await AcademicYearModel.findOrCreate({
    where: {
      groupId,
      idFromDiary
    },
    defaults
  })

  // Сохраняем семестры для текщего года
  for (const term of academicYear.terms) {
    const promise = saveOrGetTerm(term, record, authData)

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