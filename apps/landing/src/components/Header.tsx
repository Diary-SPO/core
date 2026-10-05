import { type Theme, useScrolled } from '../hooks'
import { ApkIcon, ThemeIcon } from '../icons'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const scrolled = useScrolled()

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className='container header-in'>
        <a className='brand' href='#top'>
          <img src='./icon.png' alt='Иконка приложения Дневник СПО' />
          <span>Дневник СПО</span>
        </a>
        <nav className='nav'>
          <a href='#features'>Возможности</a>
          <a href='#steps'>Как войти</a>
          <a href='#download'>Скачать</a>
          <a href='#faq'>Вопросы</a>
        </nav>
        <button
          className='btn btn-sm btn-ghost theme-toggle'
          type='button'
          aria-label={
            theme === 'dark'
              ? 'Переключить на светлую тему'
              : 'Переключить на тёмную тему'
          }
          aria-pressed={theme === 'dark'}
          onClick={onToggleTheme}
        >
          <ThemeIcon dark={theme === 'dark'} />
        </button>
        <a className='btn btn-sm btn-primary header-cta' href='#download'>
          <ApkIcon /> Скачать
        </a>
      </div>
    </header>
  )
}
