import { IMarkPerformanceResourceParam, ISubjectsMarksPerformanceResourceParam, subjectsMarksPerformance } from "@models";

export const marksPerformanceResource = async (
  param: ISubjectsMarksPerformanceResourceParam[]
) => {
  const subjects = []

  for (const subject of param) {
    subjects.push(subjectsMarksPerformance(subject))
  }

  return subjects
}