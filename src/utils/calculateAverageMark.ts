import { TextMark } from 'diary-shared';
import { Grade, GradeKeys } from '../types';

const calculateAverageMark = (marks: TextMark[] | undefined): number | null => {
  if (!marks || marks.length === 0) {
    return null;
  }

  const sum = marks.reduce((total, mark) => total + (Grade[mark as GradeKeys] as number), 0);
  return Number((sum / marks.length).toFixed(2));
};

export default calculateAverageMark;
