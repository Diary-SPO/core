import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useMemo,
  memo,
} from 'preact/compat'
import { FunctionComponent } from 'preact'
import { colors, defaultColor } from './styles'

type SubtitleColors =
  | 'red'
  | 'green'
  | 'yellow'
  | 'red-outline'
  | 'green-outline'
  | 'yellow-outline'
  | 'default'

interface ISubtitleWithBorder extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode | string
  color?: SubtitleColors
  style?: CSSProperties
}

const SubtitleWithBorder: FunctionComponent<ISubtitleWithBorder> = ({
  children,
  color = 'default',
  style,
  ...props
}) => {
  const getColorStyles = () => {
    const colorStyle = colors[color] ?? defaultColor
    return {
      borderRadius: '5px',
      padding: '3px 5px',
      ...colorStyle,
    }
  }

  return useMemo(
    () => (
      <div
        {...props}
        style={{
          display: 'inline-block',
          ...getColorStyles(),
          padding: '3px 5px',
          ...style,
        }}
      >
        {children}
      </div>
    ),
    [color, children]
  )
}

export default memo(SubtitleWithBorder)
