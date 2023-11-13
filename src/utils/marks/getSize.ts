import { Sizes } from '@components'

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
