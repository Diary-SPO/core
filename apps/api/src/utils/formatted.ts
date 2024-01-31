/**
 * Функция для форматирования даты в формате "YYYY-MM-DD".
 * @param {string} date - Строка с датой.
 * @returns {string} - Отформатированная дата.
 */
export const formatDate = (date: string): string => {
  return new Date(date).toISOString().substring(0, 10)
}
