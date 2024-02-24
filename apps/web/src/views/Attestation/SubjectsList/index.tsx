import { Subject } from '@diary-spo/shared'
import { FunctionalComponent } from 'preact'

import { Nullable } from '@types'
import SubjectGroup from './SubjectGroup'

interface ISubjectList {
  semesters: Record<string, Subject[]>
  studentName: Nullable<string>
  year: Nullable<number>
}

const SubjectList: FunctionalComponent<ISubjectList> = ({
  semesters,
  studentName,
  year
}) => {
  if (!semesters) {
    return
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
