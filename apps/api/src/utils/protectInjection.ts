// TODO: REMOVE IT
/**
 * Удаляет различные виды кавычек из переданной строки
 * Защищает от sql-инъекций
 * @param value
 * @returns {string}
 */
export const protectInjection = (value: string): string => {
  return Buffer.from(value, 'utf-8')
    .toString()
    .replaceAll('`', '')
    .replaceAll("'", '')
    .replaceAll('"', '')
}
