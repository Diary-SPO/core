import { AbsenceModel } from "@models";

/**
 * Сохраняет опоздание.
 * Если не существовало - создаёт.
 * Если существовало - обновляет (по необходимости).
 * @param absenceTypeId - Id типа опоздания из БД
 * @param scheduleId - Id расписания в БД
 * @param localUserId - Id пользователя в БД
 * @returns Promise<IAbsenceModel>
 */
export const saveOrGetAbsence = async (
  absenceTypeId: number,
  scheduleId: number,
  localUserId: number
) => AbsenceModel.findOrCreate({
  where: {
    scheduleId,
    diaryUserId: localUserId
  },
  defaults: {
    absenceTypeId,
    scheduleId,
    diaryUserId: localUserId
  }
})
.then((v) => {
  const result = v[0]
  if (v[1]) {
    return result
  }
  return result.update({absenceTypeId})
})