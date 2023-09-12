import { TextMark } from 'diary-shared';
import {Grade} from "../types";

const calculateAverageMark = (marks: TextMark[] | undefined): number | null => {
  if (!marks || marks.length === 0) {
    return null;
  }

  const sum = marks.reduce((total, mark) => total + (Grade[mark] as number), 0);
  return sum / marks.length;
};

export default calculateAverageMark;
