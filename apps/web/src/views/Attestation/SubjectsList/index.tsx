import { FunctionalComponent } from 'preact'
import LoadingData from './LoadingData'
import SubjectGroup from './SubjectGroup'
import Subject from './types.ts'

interface ISubjectList {
  semesters: Record<string, Subject[]>
  studentName: string | null
  year: number | null
  isDataLoading: boolean
}

const SubjectList: FunctionalComponent<ISubjectList> = ({
  semesters,
  studentName,
  year,
  isDataLoading
}) => (
  <div>
    {isDataLoading && <LoadingData />}
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
