import { FC } from 'react';
import {
  Group, Header, HorizontalCell, HorizontalScroll,
} from '@vkontakte/vkui';

import { Grade, PerformanceCurrent } from '../../../../../shared';

import Mark from '../Mark';

import './index.css';

interface YourComponentProps {
  performanceData: PerformanceCurrent | null;
}

const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
};

const MarksByDay: FC<YourComponentProps> = ({ performanceData }) => {
  const marksByDay: { [key: string]: { grades: Grade[]; lessonName: string } } = {};

  performanceData?.daysWithMarksForSubject.forEach((subject) => {
    subject?.daysWithMarks?.forEach((dayWithMarks) => {
      const day = new Date(dayWithMarks.day).toLocaleDateString();
      const grades = dayWithMarks.markValues.map((gradeText) => Grade[gradeText]);
      const lessonName = subject.subjectName;
      if (!marksByDay[day]) {
        marksByDay[day] = { grades: [], lessonName: '' };
      }

      marksByDay[day].grades = [...marksByDay[day].grades, ...grades];
      marksByDay[day].lessonName = lessonName;
    });
  });

  return (
    <HorizontalScroll
      showArrows
      getScrollToLeft={(i) => i - 120}
      getScrollToRight={(i) => i + 120}
    >
      <Group header={<Header mode='secondary'>Недавние оценки</Header>}>
        <div className='marksByName'>
          {Object.entries(marksByDay).map(([day, { grades, lessonName }], index) => (
            <div>
              <Header mode='secondary'>{day}</Header>
              <div key={index} style={{ display: 'flex' }}>
                {grades.map((grade, gradeIndex) => (
                  <HorizontalCell style={{ maxWidth: 'unset' }}>
                    <Mark style={{ maxWidth: 90 }} key={gradeIndex} mark={grade} size='l' bottom={truncateString(lessonName, 18)} useMargin={false} />
                  </HorizontalCell>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Group>
    </HorizontalScroll>
  );
};

export default MarksByDay;
