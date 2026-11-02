import type { FC } from 'react'
import type { TrendPoint } from '../chartData'

interface Props {
  points: TrendPoint[]
  ariaLabel?: string
}

const WIDTH = 320
const HEIGHT = 148
const PAD = { top: 16, right: 12, bottom: 28, left: 28 }
/** Точки на линии только если их немного — иначе каша. */
const MAX_DOTS = 14

const MarksTrend: FC<Props> = ({
  points: data,
  ariaLabel = 'Динамика среднего балла'
}) => {
  if (data.length < 2) return null

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const minY = 2
  const maxY = 5
  const showDots = data.length <= MAX_DOTS

  const xAt = (i: number) =>
    PAD.left + (i / (data.length - 1)) * innerW
  const yAt = (value: number) =>
    PAD.top + ((maxY - value) / (maxY - minY)) * innerH

  const points = data.map((d, i) => ({ x: xAt(i), y: yAt(d.average), ...d }))
  const line = points.map((p) => `${p.x},${p.y}`).join(' ')
  const area = [
    `${points[0].x},${PAD.top + innerH}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${PAD.top + innerH}`
  ].join(' ')

  const labelStep = Math.max(1, Math.ceil(data.length / 5))
  const grid = [2, 3, 4, 5]
  const last = points[points.length - 1]

  return (
    <svg
      className='trendChart'
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role='img'
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id='trendFill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='currentColor' stopOpacity='0.22' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </linearGradient>
      </defs>

      {grid.map((value) => {
        const y = yAt(value)
        return (
          <g key={value}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y}
              y2={y}
              className='trendChart__grid'
            />
            <text
              x={PAD.left - 6}
              y={y + 3}
              className='trendChart__axis'
              textAnchor='end'
            >
              {value}
            </text>
          </g>
        )
      })}

      <polygon points={area} fill='url(#trendFill)' />
      <polyline
        className='trendChart__line'
        points={line}
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinejoin='round'
        strokeLinecap='round'
      />

      {showDots
        ? points.map((p) => (
            <circle
              key={p.key}
              cx={p.x}
              cy={p.y}
              r='3.5'
              className='trendChart__dot'
              stroke='currentColor'
            >
              <title>
                {p.label}: {p.average}
                {p.count ? ` (${p.count} оц.)` : ''}
              </title>
            </circle>
          ))
        : (
            <circle
              cx={last.x}
              cy={last.y}
              r='4'
              className='trendChart__dot'
              stroke='currentColor'
            >
              <title>
                {last.label}: {last.average}
              </title>
            </circle>
          )}

      {points.map((p, i) =>
        i % labelStep === 0 || i === points.length - 1 ? (
          <text
            key={`l-${p.key}`}
            x={p.x}
            y={HEIGHT - 8}
            className='trendChart__axis'
            textAnchor='middle'
          >
            {p.label}
          </text>
        ) : null
      )}
    </svg>
  )
}

export default MarksTrend
