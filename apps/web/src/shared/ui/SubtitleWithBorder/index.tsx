import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react'
import { colors, defaultColor } from './styles.ts'

type SubtitleColors =
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'red-outline'
  | 'green-outline'
  | 'yellow-outline'
  | 'default'

interface ISubtitleWithBorder extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  color?: SubtitleColors
  style?: CSSProperties
}

const getColorStyles = (color: SubtitleColors) => {
  // @TODO: ?
  const colorStyle = colors[color] ?? defaultColor
  return {
    display: 'inline-block',
    borderRadius: '5px',
    padding: '3px 5px',
    ...colorStyle
  }
}

export const SubtitleWithBorder: FC<ISubtitleWithBorder> = ({
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
