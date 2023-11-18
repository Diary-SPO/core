import { Grade, TextMark } from '@diary-spo/shared'

/**
 * Функция 'calculateAverageMark' высчитывает средний балл учащегося до двух знаков после запятой.
 * Оценки приходят в формате Five, Four и тд.
 * Для верности есть дополнительная валидация оценки.
 */

export const calculateAverageMark = (
  marks: TextMark[] | undefined
): number | null => {
  if (!marks || marks.length === 0) {
    return null
  }

  let sum = 0
  let validMarksCount = 0

  marks.forEach((mark) => {
    const markNumber = Number(Grade[mark])
    if (!isNaN(markNumber)) {
      sum += markNumber
      validMarksCount++
    }
  })

  if (validMarksCount === 0) {
    return null
  }

  const average = sum / validMarksCount
  return Number(average.toFixed(2))
}
