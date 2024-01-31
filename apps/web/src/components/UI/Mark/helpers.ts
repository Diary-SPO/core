import { Sizes } from '@components'
import { ReturnedMark } from '../../../types'

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
        return '#4966CF'
      case 'О':
        return '#ffb060'
      case 'Н':
      case 'Д':
        return '#DA0A35'
      default:
        return '#959595'
    }
  }

  if (numberScore > 5) {
    return 'var(--vkui--color_accent_purple)'
  }
  if (numberScore >= 4) {
    return 'linear-gradient(135deg,#50c750,#32b332)'
  }
  if (numberScore >= 3) {
    return '#F59802'
  }

  return '#DA0A35'
}
