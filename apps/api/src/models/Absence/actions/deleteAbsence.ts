import { AbsenceModel } from "@models";

/**
 * Удаляет опоздание, если оно существовало.
 * @param scheduleId - Id расписания в БД
 * @param localUserId - Id пользователя в БД
 * @returns Promise<IAbsenceModel>
 */
export const deleteAbsence = async (
  scheduleId: number,
  localUserId: number
) => AbsenceModel.destroy({
  where: {
    scheduleId,
    diaryUserId: localUserId
  }
})