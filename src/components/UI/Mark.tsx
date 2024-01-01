import { ReturnedMark, getBackgroundColor, getSize } from '@utils'
import { Footnote } from '@vkontakte/vkui'
import { CSSProperties, FC, HTMLAttributes, useMemo } from 'preact/compat'

export type Sizes = 'l' | 's'

interface IMark extends Omit<HTMLAttributes<HTMLDivElement>, 'size'> {
  mark?: ReturnedMark
  size?: Sizes
  bottom?: string
  useMargin?: boolean
  style?: CSSProperties
}

const Mark: FC<IMark> = ({
  mark,
  size = 'l',
  useMargin = true,
  bottom,
  ...props
}) => {
  const style: CSSProperties = {
    padding: size === 'l' ? '10px 29px' : '5px 10px',
    background: getBackgroundColor(mark),
    fontSize: getSize(size),
    borderRadius: size === 'l' ? '10px' : '5px',
    color: 'white',
    marginLeft: useMargin ? 10 : undefined,
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
