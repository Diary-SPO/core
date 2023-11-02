/**
 * Функция 'isToday' проверяет, является ли переданная дата сегодняшней датой.
 * Принимает объект типа Date и сравнивает его с текущей датой.
 * Сравнивает день, месяц и год переданной даты с соответствующими значениями текущей даты.
 * Возвращает булево значение: true, если переданная дата соответствует сегодняшней дате, иначе - false.
 */

import init, * as wasm from '@rust'

export const isToday = async (date: Date): Promise<boolean> => {
  await init()

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  return wasm.is_today(day, month, year)
}

/** Пример теста
 *
 * describe('isToday test', () => {
 *   beforeAll(async () => {
 *     await init(); // Инициализация WASM-модуля
 *   });
 *
 *   it('should return true for today', () => {
 *     const date = new Date();
 *     const day = date.getDate();
 *     const month = date.getMonth();
 *     const year = date.getFullYear();
 *
 *     const result = is_today(day, month, year);
 *     expect(result).toBe(true);
 *   });
 * });
 */
