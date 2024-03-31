import { AbsenceModel } from '@models'

/**
 * Удаляет опоздание, если оно существовало.
 * @param scheduleId - Id расписания в БД
 * @param localUserId - Id пользователя в БД
 * @returns Promise<IAbsenceModel>
 */
export const deleteAbsence = async (scheduleId: bigint, localUserId: bigint) =>
  AbsenceModel.destroy({
    where: {
      scheduleId,
      diaryUserId: localUserId
    }
  })
