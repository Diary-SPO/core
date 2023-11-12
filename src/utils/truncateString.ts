/**
 * Функция 'truncateString' обрезает переданную строку до заданной максимальной длины.
 * Принимает строку 'str' и число 'maxLength' в качестве максимальной длины.
 * Если длина строки 'str' превышает 'maxLength', возвращает обрезанную строку с добавленной многоточией '...'.
 * Иначе возвращает исходную строку без изменений.
 */

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength && maxLength !== 0) {
    return `${str.substring(0, maxLength)}...`
  }
  
  return str
}
