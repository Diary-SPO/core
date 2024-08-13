/**
 * Функция для форматирования даты в формате "YYYY-MM-DD".
 * @param {string} date - Строка с датой.
 * @returns {string} - Отформатированная дата.
 */
export const formatDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toISOString().substring(0, 10)
}
