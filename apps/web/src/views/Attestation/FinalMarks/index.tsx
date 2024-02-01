import { Mark } from '@components'
import { VKUI_VIOLET } from '@config'
import { SimpleCell, Group, List, Cell } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { Grade, AcademicRecord, AttestationTerm } from '@diary-spo/shared'

interface FinalMarksProps {
  data: AcademicRecord
}

const FinalMarks: FC<FinalMarksProps> = ({ data }) => {
  if (!data) {
    return null // or any default component or message
  }

  // Создаем список всех уникальных семестров
  const allTerms = Array.from(
    new Set(
      data.academicYears.reduce(
        (terms, year) => [...terms, ...year.terms],
        [] as AttestationTerm[]
      )
    )
  )

  // Создаем ячейки для заголовка (семестров)
  const headerCells = allTerms.map((term) => (
    <SimpleCell
      key={`header-${term.number}`}
    >{`${term.number} сем.`}</SimpleCell>
  ))

  // Создаем строки для каждого предмета
  const subjectRows = data.subjects.map((subject) => {
    // Получаем итоговую оценку для предмета
    const totalMark = calculateTotalMark(subject.marks)

    // Создаем ячейки для оценок в каждом семестре
    const marks = allTerms.map((term) => {
      // Получаем оценку для текущего семестра и предмета
      const mark = subject.marks[term.id]?.value

      return (
        <SimpleCell key={`${subject.name}-${term.number}`}>
          {mark && (
            <Mark
              color={
                Number.isNaN(Number(Grade[mark])) ? VKUI_VIOLET : undefined
              }
              size='s'
              mark={Grade[mark]}
            />
          )}
        </SimpleCell>
      )
    })

    // Возвращаем группу с списком для текущего предмета
    return (
      <Group key={subject.name} header={`Курс ${subject.course}`}>
        {marks}
        <SimpleCell>
          <strong>Итог:</strong>{' '}
          <Mark
            color={
              Number.isNaN(Number(Grade[totalMark])) ? VKUI_VIOLET : undefined
            }
            size='s'
            mark={Grade[totalMark]}
          />
        </SimpleCell>
      </Group>
    )
  })

  // Возвращаем группу с общим списком предметов и оценок
  return (
    <Group>
      <List>
        <Cell>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1' }}></div>
            {headerCells}
            <div style={{ flex: '1' }}>ИТОГ</div>
          </div>
        </Cell>
        {subjectRows}
      </List>
    </Group>
  )
}

// Функция для вычисления итоговой оценки по предмету
const calculateTotalMark = (marks) => {
  return marks[marks.length - 1]?.value || 'Н/Д'
}

export default FinalMarks
