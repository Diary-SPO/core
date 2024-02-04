import { Mark } from '@components'
import { VKUI_VIOLET } from '@config'
import { TableProps } from './types.ts'
import { Grade } from '@diary-spo/shared'
import { FC, useState } from 'preact/compat'

const bgColor = 'rgba(240,240,240,0.05)'
const cellStyle = (isSelected: boolean, isHovered: boolean) => ({
  padding: '10px',
  border: '1px solid #ddd',
  backgroundColor: isSelected ? bgColor : isHovered ? bgColor : 'inherit'
})

interface Cell {
  row: number
  col: number
}

type Nullable<T> = T | null

export const Table: FC<TableProps> = ({ subjectMatrix, uniqueKeys }) => {
  const [hoveredCell, setHoveredCell] = useState<Nullable<Cell>>(null)

  const [selectedCell, setSelectedCell] = useState<Nullable<Cell>>(null)

  return (
    <table
      style={{ borderCollapse: 'collapse', width: '100%', overflow: 'hidden' }}
    >
      <thead>
        <tr>
          <th style={cellStyle(false, false)}>Дисциплина</th>
          {uniqueKeys.map((key, colIndex) => (
            <th
              key={key}
              style={cellStyle(
                selectedCell?.col === colIndex,
                hoveredCell?.col === colIndex
              )}
              onClick={() => setSelectedCell({ row: -1, col: colIndex })}
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
              style={cellStyle(
                selectedCell?.row === rowIndex,
                hoveredCell?.row === rowIndex
              )}
              onClick={() => setSelectedCell({ row: rowIndex, col: -1 })}
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
                    ...cellStyle(
                      selectedCell?.row === rowIndex ||
                        selectedCell?.col === colIndex,
                      hoveredCell?.row === rowIndex ||
                        hoveredCell?.col === colIndex
                    ),
                    textAlign: 'center'
                  }}
                  onMouseEnter={() =>
                    setHoveredCell({ row: rowIndex, col: colIndex })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
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
