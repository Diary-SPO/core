import { PerformanceCurrent } from 'diary-shared';
import { Grade, GradeKeys } from '../types';
import { IMarksByDay } from '../components/UI/MarksByDay';

export const extractMarksByDay = (performanceData: PerformanceCurrent | null): IMarksByDay => {
  const marksByDay: IMarksByDay = {};

  performanceData?.daysWithMarksForSubject?.forEach((subject) => {
    subject?.daysWithMarks?.forEach((markData) => {
      const day = new Date(markData.day).toLocaleDateString();
      const grades = markData.markValues.map((gradeText) => Grade[gradeText as GradeKeys]);
      const lessonName = subject.subjectName;

      if (grades.length > 0 && grades.every((grade) => !Number.isNaN(parseFloat(grade as string)))) {
        if (!marksByDay[day]) {
          marksByDay[day] = {};
        }

        if (!marksByDay[day][lessonName]) {
          marksByDay[day][lessonName] = [];
        }

        marksByDay[day][lessonName] = [...marksByDay[day][lessonName], ...grades];
      }
    });
  });

  return marksByDay;
};
