import { Mark } from '@components'
import { VIOLET } from '@config'
import { FC, useState } from 'preact/compat'
import { Cell, TableProps } from './types.ts'
import { buildSubjectMatrix, cellStyle } from './utils'

export const Table: FC<TableProps> = ({ data }) => {
  const subjectMatrix = buildSubjectMatrix(data)

  const [hoveredCell, setHoveredCell] = useState<Cell>(null)
  const [selectedCell, setSelectedCell] = useState<Cell>(null)

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
        {subjectMatrix.map((subjectData, rowIndex) => {
          const finalMark = subjectData.finalMark
            ? subjectData.finalMark
            : undefined
          const subjectName = subjectData.subjectName

          return (
            <tr key={subjectName + rowIndex}>
              <td
                style={cellStyle(
                  selectedCell?.row === rowIndex,
                  hoveredCell?.row === rowIndex
                )}
                onClick={() => setSelectedCell({ row: rowIndex, col: -1 })}
              >
                {subjectName}
              </td>
              {subjectData.terms.map((term, colIndex) => {
                const mark = term.mark
                return (
                  <td
                    key={`${subjectName}-${term.course}-${term.semester}`}
                    style={cellStyle(
                      selectedCell?.row === rowIndex ||
                        selectedCell?.col === colIndex,
                      hoveredCell?.row === rowIndex ||
                        hoveredCell?.col === colIndex
                    )}
                    onMouseEnter={() =>
                      setHoveredCell({ row: rowIndex, col: colIndex })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() =>
                      setSelectedCell({ row: rowIndex, col: colIndex })
                    }
                  >
                    {mark && <Mark mark={mark} size='s' />}
                  </td>
                )
              })}
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
                {finalMark ? (
                  <Mark
                    color={finalMark === 'Зч' ? VIOLET : undefined}
                    mark={finalMark}
                    size='s'
                  />
                ) : undefined}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
