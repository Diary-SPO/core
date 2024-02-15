import { Mark } from '@components'
import { VIOLET } from '@config'
import { Grade } from '@diary-spo/shared'
import { FC, useState } from 'preact/compat'
import { StateUpdater } from 'preact/hooks'
import { SubjectMatrix, TableProps } from './types.ts'

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

const renderMarks = (
  subjectName: string,
  rowIndex: number,
  uniqueKeys: string[],
  subjectMatrix: SubjectMatrix,
  selectedCell: Cell,
  hoveredCell: Cell,
  setSelectedCell: StateUpdater<Cell>,
  setHoveredCell: StateUpdater<Cell>
) => {
  return uniqueKeys.map((key, colIndex) => {
    const mark = Grade[subjectMatrix[subjectName][key]]
    const isEmpty = mark === 'Д'
    const isSelected =
      selectedCell?.row === rowIndex || selectedCell?.col === colIndex
    const isHovered =
      hoveredCell?.row === rowIndex || hoveredCell?.col === colIndex
    return (
      <td
        key={`${subjectName}-${key}`}
        style={{
          ...cellStyle(isSelected, isHovered),
          textAlign: 'center'
        }}
        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
        onMouseLeave={() => setHoveredCell(null)}
        onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
      >
        {/* Render mark */}
        {!isEmpty && mark && (
          <Mark
            color={mark === 'Зч' ? VIOLET : undefined}
            mark={mark}
            size='s'
          />
        )}
        {/* Render empty mark */}
        {!mark && !isEmpty && '.'}
      </td>
    )
  })
}

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
            {renderMarks(
              subjectName,
              rowIndex,
              uniqueKeys,
              subjectMatrix,
              selectedCell,
              hoveredCell,
              setSelectedCell,
              setHoveredCell
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
