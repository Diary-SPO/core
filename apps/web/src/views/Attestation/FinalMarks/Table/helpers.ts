import { Grade, MarkKeys } from '@diary-spo/shared'
import { TermMark } from './types.ts'

export const getMark = (value: MarkKeys): TermMark => {
  const grade = Grade[value]

  if (grade === 'Д') {
    return
  }

  return grade || ''
}

const bgColor = 'rgba(240,240,240,0.05)'

export const cellStyle = (isSelected: boolean, isHovered: boolean) => ({
  padding: '10px',
  border: '1px solid #ddd',
  backgroundColor: isSelected ? bgColor : isHovered ? bgColor : 'inherit'
})
