import { Sizes } from '@components'
import { ReturnedMark } from '../../../types'
import { GRAY, GREEN, ORANGE, RED, VIOLET } from '@config'

/**
 * Функция 'getSize' возвращает размер текста для оценки в зависимости от размера
 * */

export const getSize = (size: Sizes) => {
  switch (size) {
    case 's':
      return '1rem'
    case 'l':
      return '3rem'
    default:
      return
  }
}

/**
 * Функция getBackgroundColor возвращает цвет в зависимости от переданной оценки (score).
 * При этом оценка может быть строкой в случае, если это ДЗ / Долг / Опоздание / Н-ка.
 */

export const getBackgroundColor = (score?: ReturnedMark): string => {
  const numberScore = Number(score)

  if (Number.isNaN(numberScore)) {
    switch (score) {
      case 'ДЗ':
        return VIOLET
      case 'О':
        return ORANGE
      case 'Н':
      case 'Д':
        return RED
      default:
        return GRAY
    }
  }

  if (numberScore > 5) {
    return VIOLET
  }
  if (numberScore >= 4) {
    return GREEN
  }
  if (numberScore >= 3) {
    return ORANGE
  }

  return RED
}
