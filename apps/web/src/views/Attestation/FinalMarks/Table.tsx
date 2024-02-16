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

export const Table: FC<TableProps> = ({ subjectMatrix }) => {
  const [hoveredCell, setHoveredCell] = useState<Nullable<Cell>>(null)
  const [selectedCell, setSelectedCell] = useState<Nullable<Cell>>(null)

  return (
    <table
      style={{ borderCollapse: 'collapse', width: '100%', overflow: 'hidden' }}
    >
      <thead>
        <tr>
          <th style={cellStyle(false, false)}>Дисциплина</th>
          {subjectMatrix[0].terms.map((term, colIndex) => (
            <th
              key={`${term.course} курс ${term.semester} сем.`}
              style={cellStyle(
                selectedCell?.col === colIndex,
                hoveredCell?.col === colIndex
              )}
              onClick={() => setSelectedCell({ row: -1, col: colIndex })}
            >
              {`${term.course} курс ${term.semester} сем.`}
            </th>
          ))}
          <th
            style={cellStyle(
              selectedCell?.col === subjectMatrix[0].terms.length,
              hoveredCell?.col === subjectMatrix[0].terms.length
            )}
            onClick={() =>
              setSelectedCell({ row: -1, col: subjectMatrix[0].terms.length })
            }
          >
            ИТОГ
          </th>
        </tr>
      </thead>
      <tbody>
        {subjectMatrix.map((subjectData, rowIndex) => (
          <tr key={subjectData.subjectName + rowIndex}>
            <td
              style={cellStyle(
                selectedCell?.row === rowIndex,
                hoveredCell?.row === rowIndex
              )}
              onClick={() => setSelectedCell({ row: rowIndex, col: -1 })}
            >
              {subjectData.subjectName}
            </td>
            {subjectData.terms.map((term, colIndex) => (
              <td
                key={`${subjectData.subjectName}-${term.course}-${term.semester}`}
                style={cellStyle(
                  selectedCell?.row === rowIndex ||
                    selectedCell?.col === colIndex,
                  hoveredCell?.row === rowIndex || hoveredCell?.col === colIndex
                )}
                onMouseEnter={() =>
                  setHoveredCell({ row: rowIndex, col: colIndex })
                }
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() =>
                  setSelectedCell({ row: rowIndex, col: colIndex })
                }
              >
                {term.mark && (
                  <Mark
                    color={term.mark === 'Зч' ? VIOLET : undefined}
                    mark={term.mark}
                    size='s'
                  />
                )}
              </td>
            ))}
            <td
              style={cellStyle(
                selectedCell?.row === rowIndex ||
                  selectedCell?.col === subjectData.terms.length,
                hoveredCell?.row === rowIndex ||
                  hoveredCell?.col === subjectData.terms.length
              )}
              onClick={() =>
                setSelectedCell({
                  row: rowIndex,
                  col: subjectData.terms.length
                })
              }
            >
              {subjectData.finalMark && (
                <Mark
                  color={
                    Grade[subjectData.finalMark] === 'Зч' ? VIOLET : undefined
                  }
                  mark={Grade[subjectData.finalMark]}
                  size='s'
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
