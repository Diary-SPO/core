import type { FC } from 'react'

import { buildSubjectMatrix } from './helpers'
import type { MarksForSubjectProps } from './types.ts'

import { SubjectCard } from './SubjectCard'

export const MarksForSubject: FC<MarksForSubjectProps> = ({ data }) => {
  const subjectMatrix = buildSubjectMatrix(data)

  return (
    <div>
      {subjectMatrix.map(({ subjectName, finalMark, terms }, index) => (
        <SubjectCard
          key={`${subjectName}-${index}`}
          subjectName={subjectName}
          finalMark={finalMark}
          terms={terms}
        />
      ))}
    </div>
  )
}
