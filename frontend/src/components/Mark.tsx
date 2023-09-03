import { CSSProperties, FC } from 'react';

import { TMarks } from '../../../shared';

type Sizes = 'l' | 's';

interface IMark {
  mark: TMarks;
  size?: Sizes;
}

const getBackgroundColor = (score: TMarks) => {
  if (typeof score !== 'number') {
    console.error('invalid score');
    return '#000000';
  }
  if (score >= 4) {
    return 'linear-gradient(135deg,#50c750,#32b332)';
  } if (score === 3) {
    return '#F59802';
  }
  return '#DA0A35';
};

const Mark: FC<IMark> = ({ mark, size = 'l' }) => {
  const getSize = (size: Sizes) => {
    if (size === 's') {
      return '1rem';
    } if (size === 'l') {
      return '3rem';
    }
    return undefined;
  };

  const styles: CSSProperties = {
    padding: size === 'l' ? '10px 30px' : '5px 10px',
    background: getBackgroundColor(mark),
    fontSize: getSize(size),
    borderRadius: size === 'l' ? '10px' : '5px',
    color: 'white',
  };
  return (
    <div style={styles}>
      {mark}
    </div>
  );
};

export default Mark;
