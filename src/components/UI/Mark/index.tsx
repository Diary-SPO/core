import { Footnote } from '@vkontakte/vkui'
import { CSSProperties, FC, HTMLAttributes, useMemo } from 'preact/compat'
import { ReturnedMark } from '../../../types'
import { getBackgroundColor, getSize } from './helpers.ts'

export type Sizes = 'l' | 's'

interface IMark extends Omit<HTMLAttributes<HTMLDivElement>, 'size'> {
  mark?: ReturnedMark
  size?: Sizes
  bottom?: string
  color?: string
  style?: CSSProperties
}

const Mark: FC<IMark> = ({ mark, size = 'l', bottom, color, ...props }) => {
  const style: CSSProperties = {
    padding: size === 'l' ? '10px 29px' : '5px 10px',
    background: color ?? getBackgroundColor(mark),
    fontSize: getSize(size),
    borderRadius: size === 'l' ? '10px' : '5px',
    color: 'white',
    display: 'inline-block'
  }

  return useMemo(
    () => (
      <div {...props}>
        <div style={style}>{mark}</div>
        {bottom && (
          // @ts-ignore
          <Footnote style={{ padding: 3 }}>{bottom}</Footnote>
        )}
      </div>
    ),
    [mark, bottom, size]
  )
}

export default Mark
