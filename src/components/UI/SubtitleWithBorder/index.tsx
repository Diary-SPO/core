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

const getColorStyles = (color: SubtitleColors) => {
  const colorStyle = colors[color] ?? defaultColor
  return {
    display: 'inline-block',
    borderRadius: '5px',
    padding: '3px 5px',
    ...colorStyle,
  }
}

const SubtitleWithBorder: FunctionComponent<ISubtitleWithBorder> = ({
  children,
  color = 'default',
  style,
  ...props
}) => {
  const styles = {
    ...getColorStyles(color),
    ...style,
  }

  return useMemo(
    () => (
      <div {...props} style={styles}>
        {children}
      </div>
    ),
    [color, children]
  )
}

export default memo(SubtitleWithBorder)
