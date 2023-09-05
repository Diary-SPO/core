import { FC, ReactNode } from 'react';

interface ISubtitleWithBorder {
  children: ReactNode | string;
  color?: 'red' | 'green' | 'default';
}

const SubtitleWithBorder: FC<ISubtitleWithBorder> = ({ children, color = 'default' }) => {
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
        margin: '0 5px 5px 0',
        display: 'inline-block',
        ...getColorStyles(), // Применяем стили в зависимости от выбранного цвета
        padding: '3px 5px',
      }}
    >
      {children}
    </div>
  );
};

export default SubtitleWithBorder;
