import type { Nullable, Subject } from '@diary-spo/shared'
import { Group, Header } from '@vkontakte/vkui'
import type { FC } from 'react'

import SubjectCard from './SubjectCard.tsx'

export interface ISubjectGroup {
  semesterKey: string
  subjects: Subject[]
  studentName: Nullable<string>
  year?: Nullable<number>
}

const SubjectGroup: FC<ISubjectGroup> = ({
  semesterKey,
  subjects,
  studentName,
  year
}) => (
  <Group
    className='tableWrapper'
    mode='plain'
    key={semesterKey}
    header={
      <Header
        style={{ alignItems: 'center' }}
        size='m'
        after={studentName + (year ? `, ${year}` : '')}
      >
        {semesterKey}
      </Header>
    }
  >
    {subjects.map((subject) => (
      <SubjectCard key={subject.id} subject={subject} />
    ))}
  </Group>
)

export default SubjectGroup
