export const getTimezone = (): string => {
  // Время сдвига (всего)
  let mins: number | string = new Date().getTimezoneOffset()
  // Сдвиг в часах
  let hours: number | string = new Date().getTimezoneOffset() / 60

  /*
   * Округляем часы до целого.
   * Если часы отрицательные, то до большего, т.к. иначе неправильные минуты будут.
   * Аналогично с положительным, но уже до меньшего.
   */
  hours = hours < 0 ? Math.ceil(hours) : Math.floor(hours)
  // Получаем оставшиеся минуты
  mins = mins % 60

  // Приводим часы к формату: +/-HH
  hours = hours < 10 ? `+0${Math.abs(hours)}` : hours
  // Приводим время к формату MM
  mins = mins < 10 ? `0${mins}` : mins

  // Получаем результат
  const resultTimeZone = `${hours}:${mins}`

  return resultTimeZone
}
