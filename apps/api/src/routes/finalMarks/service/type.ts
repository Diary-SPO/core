import { IAcademicYearModel, IFinalMarkModel, ITermModel, ITermSubjectModel } from "@models"

export type RawFinalMarksFromDB = {
	subjectMarks: Array<IAcademicYearModel & {
		terms: Array<ITermModel & {
			termSubjects: Array<ITermSubjectModel>
		}>
	}>
	finalMarks: Array<IFinalMarkModel>
}