import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useMemo,
} from 'preact/compat'
import { FunctionComponent } from 'preact'
import { memo } from 'react'
import { colors, defaultColor } from './styles.ts'

interface ISubtitleWithBorder extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode | string
  color?:
    | 'red'
    | 'green'
    | 'yellow'
    | 'red-outline'
    | 'green-outline'
    | 'yellow-outline'
    | 'default'
  style?: CSSProperties
}

const SubtitleWithBorder: FunctionComponent<ISubtitleWithBorder> = ({
  children,
  color = 'default',
  style,
  ...props
}) => {
  const getColorStyles = () => {
    console.log(colors[color])
    const colorStyle = colors[color] ?? defaultColor
    return {
      borderRadius: '5px',
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
