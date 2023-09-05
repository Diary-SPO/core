import { AbsenceType, TextMark } from '../../../shared';

const setDefaultMarkIfEmpty = (marks: TextMark[], absenceType?: AbsenceType): TextMark => {
  if (marks.length === 0) {
    return absenceType === 'IsAbsent' ? 'Н' : 'Д';
  }

  return marks[0];
};

export default setDefaultMarkIfEmpty;
