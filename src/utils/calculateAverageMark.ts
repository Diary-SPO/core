import { Grade, TextMark } from 'diary-shared';

const calculateAverageMark = (marks: TextMark[] | undefined): number | null => {
  if (!marks || marks.length === 0) {
    return null;
  }
  
  let sum = 0;
  let validMarksCount = 0;
  
  marks.forEach(mark => {
    const markNumber = Number(Grade[mark])
    if (!isNaN(markNumber)) {
      sum += markNumber;
      validMarksCount++;
    }
  });
  
  if (validMarksCount === 0) {
    return null;
  }

  const average = sum / validMarksCount;
  return Number(average.toFixed(2));
};

export default calculateAverageMark;
