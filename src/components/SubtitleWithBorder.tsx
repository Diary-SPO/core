import { CSSProperties, FC, ReactNode } from 'react';

interface ISubtitleWithBorder {
  children: ReactNode | string;
  color?: 'red' | 'green' | 'yellow' | 'red-outline' | 'green-outline' | 'yellow-outline' | 'default';
  style?: CSSProperties;
}

const SubtitleWithBorder: FC<ISubtitleWithBorder> = ({ children, color = 'default', style }) => {
  const getColorStyles = () => {
    switch (color) {
      case 'red':
        return {
          backgroundColor: '#DA0A35',
          borderRadius: '5px',
          border: '1px solid #DA0A35',
          color: 'white',
        };
      case 'green':
        return {
          backgroundColor: 'green',
          borderRadius: '5px',
          border: '1px solid green',
          color: 'white',
        };
      case 'green-outline':
        return {
          color: 'green',
          borderRadius: '5px',
          border: '1px solid green',
        };
      case 'yellow-outline':
        return {
          borderRadius: '5px',
          border: '1px solid #ffb060',
          color: '#ffb060',
        };
      case 'red-outline':
        return {
          borderRadius: '5px',
          border: '1px solid #DA0A35',
          color: '#DA0A35',
        };
      case 'yellow':
        return {
          backgroundColor: '#ffb060',
          borderRadius: '5px',
          border: '1px solid #ffb060',
          color: 'white',
        };
      case 'default':
      default:
        return {
          borderRadius: '5px',
          border: '1px solid var(--vkui--color_background_accent_themed)',
          color: 'var(--vkui--color_background_accent_themed)',
        };
    }
  };

  return (
    <div
      style={{
        // margin: '0 5px 5px 0',
        display: 'inline-block',
        ...getColorStyles(),
        padding: '3px 5px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default SubtitleWithBorder;
