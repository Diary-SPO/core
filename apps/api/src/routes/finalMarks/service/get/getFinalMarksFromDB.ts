import { ICacheData } from "@helpers";
import { AcademicYearModel, FinalMarkModel, TermModel, TermSubjectModel } from "@models";
import { RawFinalMarksFromDB } from "../type";

export const getFinalMarksFromDB = async (authData: ICacheData) => {
  const subjectMarks = AcademicYearModel.findAll({
    include: {
      model: TermModel,
      include: [{
        model: TermSubjectModel,
        where: {
          diaryUserId: authData.localUserId
        }
      }]
    }
  })

  const finalMarks = FinalMarkModel.findAll({
    where: {
      diaryUserId: authData.localUserId
    }
  })


  return {
    subjectMarks: await subjectMarks,
    finalMarks: await finalMarks
  } as RawFinalMarksFromDB
}