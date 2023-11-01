/**
 * Функция 'formatLessonName' форматирует название урока, добавляя к нему дополнительную информацию, если есть разделитель '/'.
 * Если переданная строка 'name' содержит '/', функция разбивает её на части, берёт первую часть и добавляет к ней оставшиеся части в скобках.
 * Возвращает отформатированное название урока.
 */

export const formatLessonName = (name: string): string => {
  let lessonName = name || ''
  if (lessonName.includes('/')) {
    const [firstPart, ...additionalParts] = lessonName.split('/')
    lessonName = `${firstPart} (${additionalParts.join('/')})`.trim()
  }
  return lessonName
}
