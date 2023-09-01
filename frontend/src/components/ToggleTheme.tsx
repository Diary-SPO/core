import { FC } from 'react';
import { Icon28MoonOutline, Icon28SunOutline } from '@vkontakte/icons';
import { CellButton, useAppearance } from '@vkontakte/vkui';

interface IToggleTheme {
  toggleAppearance: () => void
}

const ToggleTheme: FC<IToggleTheme> = ({ toggleAppearance }) => {
  const appearance = useAppearance();
  const BeforeIcon = appearance === 'light' ? <Icon28MoonOutline /> : <Icon28SunOutline />;

  const handleToggle = () => {
    toggleAppearance();
    window.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <CellButton onClick={handleToggle} aria-label='Сменить тему' before={BeforeIcon}>
      Сменить тему
    </CellButton>
  );
};

export default ToggleTheme;
