import type { FC } from 'react'
import { MARK_COLORS } from '../chartData'

interface Props {
  markCounts: Record<number, number>
}

const MarkDistribution: FC<Props> = ({ markCounts }) => {
  const marks = [5, 4, 3, 2] as const
  const max = Math.max(...marks.map((m) => markCounts[m] ?? 0), 1)
  const total = marks.reduce((sum, m) => sum + (markCounts[m] ?? 0), 0)

  if (!total) return null

  return (
    <div className='marksChart' aria-label='Распределение оценок'>
      {marks.map((mark) => {
        const count = markCounts[mark] ?? 0
        const pct = Math.round((count / max) * 100)
        return (
          <div key={mark} className='marksChart__row'>
            <span
              className='marksChart__badge'
              style={{ background: MARK_COLORS[mark] }}
            >
              {mark}
            </span>
            <div className='marksChart__track'>
              <div
                className='marksChart__fill'
                style={{
                  width: `${pct}%`,
                  background: MARK_COLORS[mark]
                }}
              />
            </div>
            <span className='marksChart__value'>
              {count}
              <span className='marksChart__hint'>
                {total ? ` · ${Math.round((count / total) * 100)}%` : ''}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default MarkDistribution
