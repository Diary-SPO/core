import { useEffect, useId, useState } from 'react'
import { type Theme, useScrolled } from '../hooks'
import { ApkIcon, ThemeIcon } from '../icons'
import { publicUrl } from '../lib/site'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

const NAV = [
  { href: '#features', label: 'Возможности' },
  { href: '#steps', label: 'Как войти' },
  { href: '#download', label: 'Скачать' },
  { href: '#faq', label: 'Вопросы' }
] as const

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 961px)').matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={`header header--home${scrolled ? ' is-scrolled' : ''}${open ? ' is-nav-open' : ''}`}
    >
      <div className='container'>
        <div className='header-bento'>
          <a className='brand' href='#top' onClick={close}>
            <img
              src={publicUrl('icon.png')}
              alt='Иконка приложения Дневник СПО'
            />
            <span>Дневник СПО</span>
          </a>

          <nav className='nav nav--desktop' aria-label='Разделы сайта'>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
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

          <button
            className='btn btn-sm btn-ghost nav-toggle'
            type='button'
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              className='nav-toggle-icon'
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              aria-hidden='true'
            >
              <g className='nav-toggle-open'>
                <path
                  d='M3.5 5.5h11'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M3.5 9h11'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M3.5 12.5h11'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </g>
              <g className='nav-toggle-close'>
                <path
                  d='M4.5 4.5 13.5 13.5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='m13.5 4.5-9 9'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </g>
            </svg>
          </button>
        </div>

        <div
          className='header-panel'
          id={panelId}
          hidden={!open}
          aria-hidden={!open}
        >
          <nav className='nav nav--mobile' aria-label='Мобильное меню'>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={close}>
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className='btn btn-primary header-panel-cta'
            href='#download'
            onClick={close}
          >
            <ApkIcon /> Скачать
          </a>
        </div>
      </div>
    </header>
  )
}
