import { Task, TextMark } from '../../../shared';

const setDefaultMark = (task: Task): TextMark => {
  if (task.isRequired && !task.mark) {
    return '';
  }
  return task.mark || '';
};

export default setDefaultMark;
