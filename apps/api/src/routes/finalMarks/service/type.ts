import type { IAcademicYearModel } from '../../../models/AcademicYear'
import type { IFinalMarkModel } from '../../../models/FinalMark'
import type { MarkValueModelType } from '../../../models/MarkValue'
import type { SubjectModelType } from '../../../models/Subject'
import type { TermModelType } from '../../../models/Term'
import type { TermSubjectModelType } from '../../../models/TermSubject'
import type { TermTypeModelType } from '../../../models/TermType'

export type RawFinalMarksFromDB = {
  subjectMarks: Array<RawSubjectMark>
  finalMarks: Array<RawFinalMark>
}

export type RawSubjectMark = IAcademicYearModel & {
  termType: TermTypeModelType
  terms: Array<
    TermModelType & {
      termSubjects: Array<
        TermSubjectModelType & {
          subject: SubjectModelType
          markValue: MarkValueModelType
        }
      >
    }
  >
}

export type RawFinalMark = IFinalMarkModel & {
  markValue: MarkValueModelType
  subject: SubjectModelType
}
