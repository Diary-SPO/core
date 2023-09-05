import { Grade, TextMark } from '../../../shared';

const calculateAverageMark = (marks: TextMark[]): number | null => {
  if (marks.length === 0) {
    return null;
  }

  const sum = marks.reduce((total, mark) => total + (Grade[mark] as number), 0);
  return sum / marks.length;
};

export default calculateAverageMark;
