/**
 * Асинхронная функция 'logOut' выполняет выход пользователя.
 * Очищает локальное хранилище и перезагружает текущую страницу.
 */

export const logOut = async () => {
  localStorage.clear()
  window.location.reload()
}
