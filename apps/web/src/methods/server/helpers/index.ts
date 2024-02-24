/**
 * Функция 'formatDateForRequest' преобразует объект типа Date в строку в формате 'YYYY-MM-DD'.
 * Извлекает год, месяц и день из переданного объекта Date.
 * Месяц увеличивается на 1 (для корректного представления месяца) и приводится к строке, затем дополняется нулями при необходимости.
 * День также приводится к строке и при необходимости дополняется нулями.
 * Возвращает строку в формате 'YYYY-MM-DD', представляющую переданную дату.
 */

export const formatDateForRequest = (date: Date): string => {
    const year: number = date.getFullYear()
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    const day: string = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}
