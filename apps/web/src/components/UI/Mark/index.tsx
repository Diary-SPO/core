import { ReturnedMark } from '@types'
import { Footnote } from '@vkontakte/vkui'
import { CSSProperties, FC, HTMLAttributes, useMemo } from 'preact/compat'

import {
  Sizes,
  borders,
  fontSizes,
  getBackgroundColor,
  sizes
} from './helpers.ts'

interface IMark extends Omit<HTMLAttributes<HTMLDivElement>, 'size'> {
  mark?: ReturnedMark
  size?: Sizes
  bottom?: string
  color?: string
  style?: CSSProperties
}

const Mark: FC<IMark> = ({ mark, size = 'l', bottom, color, ...props }) => {
  const style: CSSProperties = {
    padding: sizes[size],
    background: color ?? getBackgroundColor(mark),
    fontSize: fontSizes[size],
    borderRadius: borders[size],
    color: 'white',
    display: 'inline-block',
    minWidth: 20
  }

  const Bottom = bottom && (
    // @ts-ignore
    <Footnote style={{ padding: 3 }}>{bottom}</Footnote>
  )

  return useMemo(
    () => (
      <div {...props}>
        <div style={style}>{mark}</div>
        {Bottom}
      </div>
    ),
    [mark, bottom, size]
  )
}

export default Mark
