import { GRAY, GREEN, ORANGE, RED, VIOLET } from '@config'
import { ReturnedMark } from '@types'

export type Sizes = 'l' | 's'

type R = Record<Sizes, string>

export const sizes: R = {
  l: '10px 29px',
  s: '5px 10px'
}

export const fontSizes: R = {
  l: '3rem',
  s: '1rem'
}

export const borders: R = {
  l: '10px',
  s: '5px'
}

/**
 * Функция getBackgroundColor возвращает цвет в зависимости от переданной оценки (score).
 * При этом оценка может быть строкой в случае, если это ДЗ / Долг / Опоздание / Н-ка.
 */

export const getBackgroundColor = (score?: ReturnedMark): string => {
  const numberScore = Number(score)

  if (Number.isNaN(numberScore)) {
    switch (score) {
      case 'Зч':
      case 'ДЗ':
        return VIOLET
      case 'О':
        return ORANGE
      case 'Н':
      case 'Д':
      case '.':
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
