import { getUsersToUpdate } from '../submodules/getUsersToUpdate'
import { updateUserCookie } from '../submodules/updateUserCookie'

export const updaterCookies = async (): Promise<void> => {
  // 1. Получаем пользователей для обновления куки
  const usersToUpdate = await getUsersToUpdate()

  // 2. Обновляем куку у списка пользователей
  if (usersToUpdate) {
    for (let i = 0; i < usersToUpdate.length; i++) {
      // тут обновить куку
      await updateUserCookie(usersToUpdate[i])
    }
  }
}
