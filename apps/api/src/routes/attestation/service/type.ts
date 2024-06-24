import type {
  AcademicYearModelType,
  ExaminationTypeModelType,
  MarkValueModelType,
  SubjectModelType,
  TeacherModelType,
  TermModelType,
  TermSubjectExaminationTypeModelType,
  TermSubjectModelType,
  TermTypeModelType
} from '../../../models'

export type IAttestationResponseRaw = AcademicYearModelType & {
  termType: TermTypeModelType
  terms: Array<
    TermModelType & {
      termSubjects: Array<
        TermSubjectModelType & {
          termSubjectExaminationType: TermSubjectExaminationTypeModelType
          examinationType?: ExaminationTypeModelType
          teacher?: TeacherModelType
          markValue?: MarkValueModelType
          subject: SubjectModelType
        }
      >
    }
  >
}
