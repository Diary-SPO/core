import { Footnote } from '@vkontakte/vkui'
import { CSSProperties, FC } from 'preact/compat'
import { ReturnedMark } from '../../../utils/setDefaultMark'

type Sizes = 'l' | 's'

interface IMark {
  mark?: ReturnedMark
  size?: Sizes
  bottom?: string
  useMargin?: boolean
  style?: CSSProperties
}

/**
 * Функция getBackgroundColor возвращает цвет в зависимости от переданной оценки (score).
 * При этом оценка может быть строкой в случае, если это ДЗ / Долг / Опоздание / Н-ка.
 */
const getBackgroundColor = (score?: ReturnedMark): string => {
  if (typeof score === 'number') {
    console.log(score)
    if (score > 5) {
      return 'var(--vkui--color_accent_purple)'
    }
    if (score >= 4) {
      return 'linear-gradient(135deg,#50c750,#32b332)'
    }
    if (score === 3) {
      return '#F59802'
    }
  } else {
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
}

const Mark: FC<IMark> = ({
  mark,
  size = 'l',
  useMargin = true,
  bottom,
  style,
}) => {
  const getSize = (size: Sizes) => {
    if (size === 's') {
      return '1rem'
    }
    if (size === 'l') {
      return '3rem'
    }
    return undefined
  }

  const styles: CSSProperties = {
    padding: size === 'l' ? '10px 29px' : '5px 10px',
    background: getBackgroundColor(mark),
    fontSize: getSize(size),
    borderRadius: size === 'l' ? '10px' : '5px',
    color: 'white',
    marginLeft: useMargin ? 10 : undefined,
    display: 'inline-block',
  }

  return (
    <div style={{ ...style }}>
      <div style={styles}>{mark}</div>
      {bottom && (
        // @ts-ignore
        <Footnote style={{ padding: 3 }}>{bottom}</Footnote>
      )}
    </div>
  )
}

export default Mark
