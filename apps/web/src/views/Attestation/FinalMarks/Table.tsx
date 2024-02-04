import { Mark } from '@components'
import { VKUI_VIOLET } from '@config'
import { TableProps } from './types.ts'
import { Grade } from '@diary-spo/shared'
import { FC, useState } from 'preact/compat'

export const Table: FC<TableProps> = ({ subjectMatrix, uniqueKeys }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const bgCoolor = 'rgba(240,240,240,0.05)'
  return (
    <table
      style={{ borderCollapse: 'collapse', width: '100%', overflow: 'hidden' }}
    >
      <thead>
        <tr>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>
            Дисциплина
          </th>
          {uniqueKeys.map((key, colIndex) => (
            <th
              key={key}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                backgroundColor:
                  hoveredCell?.col === colIndex ? bgCoolor : 'inherit'
              }}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(subjectMatrix).map((subjectName, rowIndex) => (
          <tr key={subjectName}>
            <td
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                backgroundColor:
                  hoveredCell?.row === rowIndex ? bgCoolor : 'inherit'
              }}
            >
              {subjectName}
            </td>
            {uniqueKeys.map((key, colIndex) => {
              const mark = Grade[subjectMatrix[subjectName][key]]
              const isEmpty = mark === 'Д'

              return (
                <td
                  key={`${subjectName}-${key}`}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    backgroundColor:
                      hoveredCell?.row === rowIndex ||
                      hoveredCell?.col === colIndex
                        ? bgCoolor
                        : 'inherit'
                  }}
                  onMouseEnter={() =>
                    setHoveredCell({ row: rowIndex, col: colIndex })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {!isEmpty && mark && (
                    <Mark
                      color={mark === 'Зч' ? VKUI_VIOLET : undefined}
                      mark={mark}
                      size='s'
                    />
                  )}
                  {!mark && !isEmpty && '.'}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
