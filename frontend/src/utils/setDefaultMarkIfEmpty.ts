import { TextMark } from 'dnevnik/shared/shared';

const setDefaultMarkIfEmpty = (marks: TextMark[]): TextMark => {
  if (marks.length === 0) {
    return '';
  }
  return marks[0];
};

export default setDefaultMarkIfEmpty;
