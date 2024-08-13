import type { FunctionComponent } from 'preact'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'preact/compat'
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
    ...colorStyle
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
    ...style
  }

  return (
    <div {...props} style={styles}>
      {children}
    </div>
  )
}

export default SubtitleWithBorder
