import { Group, Header } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import SubjectCard from './SubjectCard'
import Subject from './types'

interface ISubjectGroup {
  semesterKey: string
  subjects: Subject[]
  studentName: string | null
  year: number | null
}

const SubjectGroup: FunctionalComponent<ISubjectGroup> = ({
  semesterKey,
  subjects,
  studentName,
  year,
}) => (
  <Group
    key={semesterKey}
    header={
      <Header
        style={{ alignItems: 'center' }}
        mode="tertiary"
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
