import type { AcademicYearModelType } from '../../../models/AcademicYear'
import type { ExaminationTypeModelType } from '../../../models/Examination'
import type { MarkValueModelType } from '../../../models/MarkValue'
import type { SubjectModelType } from '../../../models/Subject'
import type { TeacherModelType } from '../../../models/Teacher'
import type { TermModelType } from '../../../models/Term'
import type { TermSubjectModelType } from '../../../models/TermSubject'
import type { TermSubjectExaminationTypeModelType } from '../../../models/TermSubjectExaminationType'
import type { TermTypeModelType } from '../../../models/TermType'

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
