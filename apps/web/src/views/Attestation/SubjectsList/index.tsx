import { FunctionalComponent } from 'preact'
import LoadingData from './LoadingData'
import SubjectGroup from './SubjectGroup'
import { Nullable } from '@types'
import { Subject } from '@diary-spo/shared'

interface ISubjectList {
  semesters: Record<string, Subject[]>
  studentName: Nullable<string>
  year: Nullable<number>
  isDataLoading: boolean
}

const SubjectList: FunctionalComponent<ISubjectList> = ({
  semesters,
  studentName,
  year,
  isDataLoading
}) => {
  if (isDataLoading) {
    return <LoadingData />
  }

  return (
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
}

export default SubjectList
