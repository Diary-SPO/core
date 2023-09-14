import { FC } from 'react';

interface ITimeRemainingProps {
  lessonDate: Date;
  startTime: string;
  endTime: string;
}

const getTimeRemaining = (currentDate: Date, lessonDate: Date, endTime: string, startDate: Date): string | null => {
  const endDate = new Date(lessonDate);
  endDate.setHours(Number(endTime.split(':')[0]));
  endDate.setMinutes(Number(endTime.split(':')[1]));

  const timeToStart = (startDate.getTime() - currentDate.getTime()) / (1000 * 60);

  if (timeToStart > 60) {
    return '';
  }

  if (currentDate > endDate) {
    return null;
  }

  if (currentDate < startDate) {
    return `${Math.floor(timeToStart)} мин до начала`;
  } if (currentDate < endDate) {
    const remainingMinutes = (endDate.getTime() - currentDate.getTime()) / (1000 * 60);
    return `${Math.floor(remainingMinutes)} мин до конца`;
  }
  return null;
};

const TimeRemaining: FC<ITimeRemainingProps> = ({ lessonDate, startTime, endTime }) => {
  const currentDate = new Date();
  const startDate = new Date(lessonDate);
  startDate.setHours(Number(startTime.split(':')[0]));
  startDate.setMinutes(Number(startTime.split(':')[1]));

  const timeRemainingText = getTimeRemaining(currentDate, lessonDate, endTime, startDate);

  if (!timeRemainingText) {
    return null;
  }

  const isRed = parseInt(timeRemainingText) < 30;

  const styles = {
    margin: '5px 0',
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: '5px',
    border: isRed ? '1px solid var(--vkui--color_background_negative)' : '1px solid var(--vkui--color_accent_violet)',
    color: isRed ? 'var(--vkui--color_background_negative)' : 'var(--vkui--color_accent_violet)',
  };

  return (
    <div style={styles}>
      {timeRemainingText}
    </div>
  );
};

export default TimeRemaining;
