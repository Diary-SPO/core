import React, { FC } from 'react';
import {
  Group, Header, HorizontalCell, HorizontalScroll,
} from '@vkontakte/vkui';

import { Grade, PerformanceCurrent } from '../../../../../shared';

import Mark from '../Mark';

import './index.css';

interface IPerformanceCurrent {
  performanceData: PerformanceCurrent | null;
}

const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
};

interface IMarksByDay {
  [key: string]: {
    [lessonName: string]: Grade[];
  };
}

const MarksByDay: FC<IPerformanceCurrent> = ({ performanceData }) => {
  const marksByDay: IMarksByDay = {};

  performanceData?.daysWithMarksForSubject?.forEach((subject) => {
    subject?.daysWithMarks?.forEach((dayWithMarks) => {
      const day = new Date(dayWithMarks.day).toLocaleDateString();
      const grades = dayWithMarks.markValues.map((gradeText) => Grade[gradeText]);
      const lessonName = subject.subjectName;

      if (grades.length > 0 && grades.every((grade) => !Number.isNaN(parseFloat(grade as string)))) {
        if (!marksByDay[day]) {
          marksByDay[day] = {};
        }

        if (!marksByDay[day][lessonName]) {
          marksByDay[day][lessonName] = [];
        }

        marksByDay[day][lessonName] = [...marksByDay[day][lessonName], ...grades];
      }
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
          {Object.entries(marksByDay).map(([day, lessonGrades]) => (
            <div key={day}>
              <Header mode='secondary'>{day}</Header>
              <div style={{ display: 'flex' }}>
                {Object.entries(lessonGrades).map(([lessonName, grades]) => (
                  <React.Fragment key={`${day}_${lessonName}`}>
                    {grades.map((grade, gradeIndex) => (
                      <HorizontalCell style={{ maxWidth: 'unset' }} key={`${day}_${lessonName}_${gradeIndex}`}>
                        <Mark
                          style={{ maxWidth: 90 }}
                          key={`${day}_${lessonName}_${gradeIndex}`}
                          mark={grade || 'Н'}
                          size='l'
                          bottom={truncateString(lessonName, 18)}
                          useMargin={false}
                        />
                      </HorizontalCell>
                    ))}
                  </React.Fragment>
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
