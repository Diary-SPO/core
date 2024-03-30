import { FC } from 'preact/compat'

import { buildSubjectMatrix } from './helpers'
import { MarksForSubjectProps } from './types.ts'

import { SubjectCard } from './SubjectCard.tsx'
import './index.css'

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
