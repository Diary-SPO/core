import { TextMark, TMark } from 'dnevnik/shared/shared';
import { Grade } from '../types';

const calculateAverageMark = (marks: TextMark[]): number | null => {
  if (marks.length === 0) {
    return null;
  }

  const sum = marks.reduce((total, mark) => total + (Grade[mark] as TMark), 0);
  return sum / marks.length;
};

export default calculateAverageMark;
