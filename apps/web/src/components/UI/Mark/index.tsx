import { Footnote } from '@vkontakte/vkui'
import {
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  useMemo
} from 'preact/compat'

import type { ReturnedMark } from '@types'

import {
  type Sizes,
  borders,
  fontSizes,
  getBackgroundColor,
  sizes
} from './helpers.ts'

import './index.css'

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
    borderRadius: borders[size]
  }

  const Bottom = bottom && (
    // @ts-ignore
    <Footnote style={{ padding: 3 }}>{bottom}</Footnote>
  )

  return useMemo(
    () => (
      <div {...props} style='max-width: min-content;'>
        <div className='markRoot' style={style}>
          {mark}
        </div>
        {Bottom}
      </div>
    ),
    [mark, bottom, size]
  )
}

export default Mark
