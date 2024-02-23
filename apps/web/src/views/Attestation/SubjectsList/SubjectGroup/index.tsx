import { Group, Header } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import Subject from '../types.ts'
import SubjectCard from './SubjectCard'
import { Nullable } from '@types'

export interface ISubjectGroup {
  semesterKey: string
  subjects: Subject[]
  studentName: Nullable<string>
  year: Nullable<number>
}

const SubjectGroup: FunctionalComponent<ISubjectGroup> = ({
  semesterKey,
  subjects,
  studentName,
  year
}) => (
  <Group
    mode='plain'
    key={semesterKey}
    header={
      <Header
        style={{ alignItems: 'center' }}
        mode='tertiary'
        aside={`${studentName}, ${year}`}
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
