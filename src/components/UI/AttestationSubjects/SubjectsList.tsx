import { FunctionalComponent } from 'preact'
import SubjectGroup from './SubjectGroup'
import Subject from './types'

interface ISubjectList {
  semesters: Record<string, Subject[]>
  studentName: string | null
  year: number | null
}

const SubjectList: FunctionalComponent<ISubjectList> = ({
  semesters,
  studentName,
  year,
}) => (
  <div>
    {Object.keys(semesters).map((semesterKey) => (
      <SubjectGroup
        key={semesterKey}
        semesterKey={semesterKey}
        subjects={semesters[semesterKey]}
        studentName={studentName}
        year={year}
      />
    ))}
  </div>
)

export default SubjectList
