import { CSSProperties, FC } from 'react';

import { TMark } from '../../../shared';

type Sizes = 'l' | 's';

interface IMark {
  mark: TMark;
  size?: Sizes;
  useMargin?: boolean;
}

const getBackgroundColor = (score: TMark) => {
  if (Number(score) >= 4) {
    return 'linear-gradient(135deg,#50c750,#32b332)';
  } if (score === 3) {
    return '#F59802';
  }
  return '#DA0A35';
};

const Mark: FC<IMark> = ({ mark, size = 'l', useMargin = true }) => {
  console.log(mark)
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
    marginLeft: useMargin ? 10 : undefined,
    display: 'inline-block',
  };
  return (
    <div style={styles}>
      {mark}
    </div>
  );
};

export default Mark;
