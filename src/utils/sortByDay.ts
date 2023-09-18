import { IMarksByDay } from '../components/UI/MarksByDay';
import { formatDate } from './formatDate';

export const sortByDay = (marksByDay: IMarksByDay): IMarksByDay => {
  const sortedDays = Object.keys(marksByDay).sort((a, b) => formatDate(b).getTime() - formatDate(a).getTime());
  const marksByDaySort: IMarksByDay = {};
  sortedDays.forEach((day) => {
    marksByDaySort[day] = marksByDay[day];
  });

  return marksByDaySort;
};
