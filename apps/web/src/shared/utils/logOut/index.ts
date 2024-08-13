/**
 * Асинхронная функция 'logOut' выполняет выход пользователя.
 * Очищает локальное хранилище и выполняет запрос на сервер.
 */
import { getLogout } from '../../api'

export const logOut = async () => {
  await getLogout()
  localStorage.clear()
}
