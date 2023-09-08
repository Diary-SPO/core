import { Task, TextMark } from '../../../shared';

const setDefaultMark = (task: Task): TextMark => {
  if (task.isRequired && !task.mark) {
    return 'Д';
  }

  if (task.type === 'Home' && !task.mark) {
    return 'ДЗ';
  }

  return task.mark || '';
};

export default setDefaultMark;
