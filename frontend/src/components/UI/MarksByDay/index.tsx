import { FC } from 'react';
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
  [key: string] : {
    grades: Grade[];
    lessonName: string
  }
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
          marksByDay[day] = { grades: [], lessonName: '' };
        }

        // @ts-ignore
        marksByDay[day].grades = [...marksByDay[day].grades, ...grades];
        marksByDay[day].lessonName = lessonName;
      }
    });
  });
  
  const sort_by_day = (marksByDay: IMarksByDay): IMarksByDay => {
    var mass = Object.keys(marksByDay).sort((b, a) => new Date(a).getTime() -  new Date(b).getTime());
    var marksByDaySort: IMarksByDay = {};
    mass.forEach((day) => {
      if (!marksByDaySort[day]) {
        marksByDaySort[day] = { grades: [], lessonName: '' };
      }

      // @ts-ignore
      marksByDaySort[day].grades = [...marksByDay[day].grades];
      marksByDaySort[day].lessonName = marksByDay[day].lessonName;
    })
    return marksByDaySort;
  }

  return (
    <HorizontalScroll
      showArrows
      getScrollToLeft={(i) => i - 120}
      getScrollToRight={(i) => i + 120}
    >
      <Group header={<Header mode='secondary'>Недавние оценки</Header>}>
        <div className='marksByName'>
          {Object.entries(sort_by_day(marksByDay)).map(([day, { grades, lessonName }]) => (
            <div key={day}>
              <Header mode='secondary'>{day}</Header>
              <div style={{ display: 'flex' }}>
                {grades.map((grade, gradeIndex) => (
                  <HorizontalCell style={{ maxWidth: 'unset' }} key={`${day}_${gradeIndex}`}>
                    <Mark style={{ maxWidth: 90 }} mark={grade || 'Н'} size='l' bottom={truncateString(lessonName, 18)} useMargin={false} />
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
