import {
  IAcademicYearModel,
  IFinalMarkModel,
  MarkValueModelType,
  SubjectModelType,
  TermModelType,
  TermSubjectModelType,
  TermTypeModelType
} from '@models'

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
  subject: SubjectModelType
  markValue: MarkValueModelType
}
