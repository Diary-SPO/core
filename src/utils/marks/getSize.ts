import { Sizes } from '../../components/UI/Mark'

export const getSize = (size: Sizes) => {
  if (size === 's') {
    return '1rem'
  }
  if (size === 'l') {
    return '3rem'
  }
  return undefined
}
