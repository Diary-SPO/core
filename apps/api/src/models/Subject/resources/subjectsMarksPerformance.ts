import { 
  IScheduleMarksPerformanceResourceReturn,
  scheduleMarksPerformance,
  ISubjectsMarksPerformanceResourceParam,
  ISubjectsMarksPerformanceResourceReturn
} from "@models"

export const subjectsMarksPerformance = (
  param: ISubjectsMarksPerformanceResourceParam
): ISubjectsMarksPerformanceResourceReturn => {
  const daysWithMarks: IScheduleMarksPerformanceResourceReturn[] = []

  for (const schedule of param.schedules) {
    let isAdded = false
    const dayMarks = scheduleMarksPerformance(schedule)
    for (const day of daysWithMarks) {
      if (day.day !== dayMarks.day) {
        continue
      }
      day.markValues.push(...dayMarks.markValues)
      isAdded = true
      break
    }
    if (!isAdded) {
      daysWithMarks.push(dayMarks)
    }
  }

  return {
    subjectName: param.name,
    daysWithMarks
  }
}