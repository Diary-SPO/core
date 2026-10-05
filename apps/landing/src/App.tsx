import { useEffect, useRef, useState } from 'react'
import { LINKS } from './config'

const FEATURES = [
  {
    color: '#e5482f',
    bg: './showcase/bg-red.svg',
    title: 'Наглядное расписание на неделю',
    text: 'Пары по дням: время, корпус, кабинет, преподаватель. Листайте неделю и возвращайтесь кнопкой «Домой».',
    img: './showcase/phone-schedule.webp',
    alt: 'Экран расписания на неделю в приложении Дневник СПО'
  },
  {
    color: '#0a9b4d',
    bg: './showcase/bg-green.svg',
    title: 'Подробная информация о паре',
    text: 'Предмет, тип занятия, аудитория, время и успеваемость — всё в карточке «Подробнее о паре».',
    img: './showcase/phone-lesson.webp',
    alt: 'Карточка подробной информации о паре'
  },
  {
    color: '#3b3bbf',
    bg: './showcase/bg-purple.svg',
    title: 'Детальная статистика успеваемости',
    text: 'Общий и средний балл, количество оценок, текущие и итоговые. Видно, что подтянуть.',
    img: './showcase/phone-grades.webp',
    alt: 'Экран статистики успеваемости студента'
  },
  {
    color: '#9333ea',
    bg: './showcase/bg-violet.svg',
    title: 'Объявления в один клик',
    text: 'Графики занятий, переносы и новости колледжа без похода в браузер Сетевого города.',
    img: './showcase/phone-news.webp',
    alt: 'Экран объявлений учебной организации'
  }
]

const FAQ = [
  {
    q: 'Это официальное приложение Сетевого города?',
    a: 'Нет. Дневник СПО — независимый неофициальный клиент. Он не является продуктом АО «ИРТех» и операторов региональных порталов.'
  },
  {
    q: 'Мой регион поддерживается?',
    a: 'Да. Мобильное приложение работает со всеми регионами Сетевого города: регион и портал выбираются на экране входа.'
  },
  {
    q: 'Это безопасно? Куда уходит пароль?',
    a: 'Данные входа передаются напрямую с телефона в ваш электронный дневник по HTTPS. Приложение не сохраняет пароль в исходном виде, серверы разработчика в обмене не участвуют.'
  },
  {
    q: 'Что нужно для входа?',
    a: 'Действующая учётная запись электронного дневника: регион, логин и пароль, которые выдаёт учебная организация.'
  },
  {
    q: 'Подойдёт ли приложение школьникам?',
    a: 'Нет. Дневник СПО работает только с модулем ПОО системы «Сетевой город. Образование»: колледжи, техникумы, училища. Школьные дневники не поддерживаются.'
  },
  {
    q: 'Сколько стоит? Есть ли реклама?',
    a: 'Бесплатно, без рекламы и встроенных покупок.'
  },
  {
    q: 'Почему меня просят принять соглашения?',
    a: 'Перед входом нужно принять политику конфиденциальности и пользовательское соглашение — так требуют правила публикации.'
  }
]

function ApkIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M12 4v11m0 0 4-4m-4 4-4-4M4.5 19.5h15'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function WebIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='8.5' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='12' cy='12' r='4.5' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  ) : (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`faq-chevron${open ? ' is-open' : ''}`}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='m6 9 6 6 6-6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='9'
        y='9'
        width='11'
        height='11'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M5 15V6a2 2 0 0 1 2-2h9'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => {
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return ref
}

export function App() {
  const [webModal, setWebModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [paused, setPaused] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [copied, setCopied] = useState<'ok' | 'err' | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('landing-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })
  const pageRef = useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset timer on manual switch
  useEffect(() => {
    if (paused || webModal) return
    const t = setInterval(
      () => setActiveFeature((i) => (i + 1) % FEATURES.length),
      5000
    )
    return () => clearInterval(t)
  }, [paused, webModal, activeFeature])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('landing-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!webModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWebModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [webModal])

  const copyApk = async () => {
    const done = (ok: boolean) => {
      setCopied(ok ? 'ok' : 'err')
      setTimeout(() => setCopied(null), 2200)
    }
    try {
      await navigator.clipboard.writeText(LINKS.apk)
      done(true)
      return
    } catch {
      // clipboard API недоступен (http, старый браузер) — пробуем fallback
    }
    try {
      const ta = document.createElement('textarea')
      ta.value = LINKS.apk
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      done(ok)
    } catch {
      done(false)
    }
  }

  const feature = FEATURES[activeFeature]

  return (
    <div ref={pageRef}>
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
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <ThemeIcon dark={theme === 'dark'} />
          </button>
          <a className='btn btn-sm btn-primary header-cta' href='#download'>
            <ApkIcon /> Скачать
          </a>
        </div>
      </header>

      <main id='top'>
        <section className='hero'>
          <div className='hero-bg' aria-hidden='true' />
          <div className='container hero-grid'>
            <div className='reveal'>
              <p className='badge'>
                <span className='badge-dot' /> Неофициальный клиент Сетевого
                города · Android
              </p>
              <h1>
                Сетевой город
                <br />
                <span className='h1-accent'>в удобном приложении</span>
              </h1>
              <p className='lead'>
                Дневник СПО работает во всех регионах: расписание, оценки,
                объявления и статистика успеваемости — быстрее и понятнее, чем в
                браузере.
              </p>
              <div className='cta'>
                <a
                  className='btn btn-primary btn-lg'
                  href={LINKS.rustore}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    className='btn-icon'
                    src='./rustore.svg'
                    alt=''
                    aria-hidden='true'
                  />{' '}
                  Скачать в RuStore
                </a>
                <a className='btn btn-lg' href={LINKS.apk}>
                  <ApkIcon /> APK
                </a>
                <button
                  className='btn btn-ghost btn-lg'
                  type='button'
                  onClick={() => setWebModal(true)}
                >
                  <WebIcon /> Веб-версия
                </button>
              </div>
              <p className='hint'>
                Бесплатно · без рекламы · нужен логин и пароль от электронного
                дневника
              </p>
            </div>
            <div className='hero-visual reveal'>
              <img
                src='./cat.webp'
                alt='Котик — маскот приложения Дневник СПО'
                fetchPriority='high'
              />
            </div>
          </div>
          <dl className='container hero-stats reveal'>
            <div>
              <span className='stat-icon' aria-hidden='true'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <circle
                    cx='12'
                    cy='12'
                    r='8.5'
                    stroke='currentColor'
                    strokeWidth='1.8'
                  />
                  <path
                    d='M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                </svg>
              </span>
              <dt>Все регионы</dt>
              <dd>выбор портала Сетевого города на экране входа</dd>
            </div>
            <div>
              <span className='stat-icon' aria-hidden='true'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <rect
                    x='4'
                    y='5.5'
                    width='16'
                    height='15'
                    rx='2.5'
                    stroke='currentColor'
                    strokeWidth='1.8'
                  />
                  <path
                    d='M4 10h16M8.5 3.5v4M15.5 3.5v4'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
              <dt>Расписание на неделю</dt>
              <dd>пары, кабинеты, преподаватели, кнопка «Домой»</dd>
            </div>
            <div>
              <span className='stat-icon' aria-hidden='true'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M4 19.5 9.5 14l3.5 3.5L20 10'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15 10h5v5'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              <dt>Оценки и статистика</dt>
              <dd>текущие, итоговые, средний балл, уведомления</dd>
            </div>
            <div>
              <span className='stat-icon' aria-hidden='true'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M4 10v4h3l6 4V6l-6 4H4Z'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16.5 9.5a4 4 0 0 1 0 5M19 7a8 8 0 0 1 0 10'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
              <dt>Объявления колледжа</dt>
              <dd>графики занятий и новости в один клик</dd>
            </div>
          </dl>
        </section>

        <section className='container spo-section'>
          <div className='spo-banner reveal'>
            <div className='spo-col spo-yes'>
              <span className='spo-mark' aria-hidden='true'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='m5 12.5 4.5 4.5L19 7.5'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              <div>
                <b>Подойдёт вам, если вы студент</b>
                <p>
                  колледжа, техникума или училища — приложение работает с
                  модулем ПОО системы «Сетевой город. Образование»
                </p>
              </div>
            </div>
            <div className='spo-col spo-no'>
              <span className='spo-mark' aria-hidden='true'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M7 7l10 10M17 7 7 17'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
              <div>
                <b>Не подойдёт школьникам</b>
                <p>школьный модуль Сетевого города не поддерживается</p>
              </div>
            </div>
          </div>
        </section>

        <section id='features' className='container section'>
          <div className='section-head reveal'>
            <h2>Что внутри приложения</h2>
            <p>Листайте экраны — как в сторе, только интерактивно.</p>
          </div>
          <div className='showcase reveal'>
            <div
              className='showcase-list'
              role='tablist'
              aria-label='Экраны приложения'
            >
              {FEATURES.map((f, i) => (
                <button
                  key={f.title}
                  type='button'
                  role='tab'
                  aria-selected={i === activeFeature}
                  className={`showcase-tab${i === activeFeature ? ' is-active' : ''}`}
                  style={{ ['--tab-color' as string]: f.color }}
                  onClick={() => setActiveFeature(i)}
                  onMouseEnter={() => setPaused(true)}
                  onFocus={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onBlur={() => setPaused(false)}
                >
                  <span className='tab-title'>{f.title}</span>
                  <span className='tab-text'>{f.text}</span>
                  {i === activeFeature && (
                    <span className='tab-progress' aria-hidden='true' />
                  )}
                </button>
              ))}
            </div>
            <div
              className='showcase-shot'
              style={{ backgroundImage: `url(${feature.bg})` }}
              key={feature.img}
            >
              <img
                src={feature.img}
                alt={feature.alt}
                loading='lazy'
                className='shot-fade'
              />
            </div>
          </div>
        </section>

        <section id='steps' className='container section'>
          <div className='section-head reveal'>
            <h2>Как войти за минуту</h2>
            <p>Тот же логин и пароль, что для Сетевого города в браузере.</p>
          </div>
          <ol className='steps reveal'>
            <li>
              <span className='step-n'>1</span>
              <b>Установите</b>
              <span>через RuStore или APK с этого сайта</span>
            </li>
            <li>
              <span className='step-n'>2</span>
              <b>Выберите регион</b>
              <span>найдите свой город и портал дневника</span>
            </li>
            <li>
              <span className='step-n'>3</span>
              <b>Введите логин и пароль</b>
              <span>пароль уходит напрямую в дневник и не хранится</span>
            </li>
          </ol>
        </section>

        <section id='download' className='container section'>
          <div className='download-card reveal'>
            <div>
              <h2>Скачать Дневник СПО</h2>
              <p>Android · бесплатно. Выберите удобный способ установки.</p>
              <div className='cta'>
                <a
                  className='btn btn-primary btn-lg'
                  href={LINKS.rustore}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    className='btn-icon'
                    src='./rustore.svg'
                    alt=''
                    aria-hidden='true'
                  />{' '}
                  RuStore
                </a>
                <a className='btn btn-lg' href={LINKS.apk}>
                  <ApkIcon /> APK напрямую
                </a>
                <button
                  className='btn btn-ghost btn-lg'
                  type='button'
                  onClick={() => setWebModal(true)}
                >
                  <WebIcon /> Веб-версия
                </button>
              </div>
              <button
                className={`copy-link${copied === 'ok' ? ' is-ok' : copied === 'err' ? ' is-err' : ''}`}
                type='button'
                onClick={copyApk}
              >
                <CopyIcon />{' '}
                {copied === 'ok'
                  ? 'Ссылка скопирована!'
                  : copied === 'err'
                    ? 'Не удалось скопировать — зажмите ссылку в адресной строке'
                    : 'Скопировать ссылку на APK'}
              </button>
            </div>
            <img
              className='download-icon'
              src='./icon.png'
              alt='Иконка приложения Дневник СПО'
              loading='lazy'
            />
          </div>
          <p className='hint'>
            Нет RuStore — ставьте APK. Разрешите установку из браузера один раз,
            дальше обновления как обычно.
          </p>
        </section>

        <section id='faq' className='container section'>
          <div className='section-head reveal'>
            <h2>Частые вопросы</h2>
          </div>
          <div className='faq reveal'>
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <div className={`faq-item${open ? ' is-open' : ''}`} key={f.q}>
                  <button
                    type='button'
                    className='faq-q'
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <ChevronIcon open={open} />
                  </button>
                  <div className='faq-a' aria-hidden={!open}>
                    <p>{f.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <footer className='footer'>
        <div className='container footer-grid'>
          <div className='footer-brand'>
            <img src='./icon.png' alt='' aria-hidden='true' />
            <div>
              <b>Дневник СПО</b>
              <p>
                Независимый проект. Не является официальным приложением Сетевого
                города и АО «ИРТех».
              </p>
            </div>
          </div>
          <div className='footer-links'>
            <div className='socials'>
              <a
                href={LINKS.vk}
                target='_blank'
                rel='noreferrer'
                aria-label='Группа Дневника СПО во VK'
              >
                <span className='sr-only'>Группа Дневника СПО во VK</span>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M12.93 17.5c-5.4 0-8.5-3.7-8.63-9.9h2.7c.09 4.54 2.1 6.46 3.69 6.86V7.6h2.55v3.9c1.56-.17 3.2-1.95 3.75-3.9h2.55c-.71 2.7-2.55 4.7-3.8 5.32 1.25.6 3.25 2.14 4.01 4.58h-2.8c-.6-1.9-2.1-3.37-4.34-3.58v3.58h-.65Z' />
                </svg>
              </a>
              <a
                href={LINKS.github}
                target='_blank'
                rel='noreferrer'
                aria-label='Исходный код на GitHub'
              >
                <span className='sr-only'>Исходный код на GitHub</span>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M12 2.5A9.5 9.5 0 0 0 2.5 12c0 4.2 2.72 7.76 6.5 9.02.48.09.65-.2.65-.46v-1.63c-2.65.58-3.21-1.13-3.21-1.13-.43-1.1-1.06-1.4-1.06-1.4-.86-.6.07-.58.07-.58.95.07 1.46.98 1.46.98.85 1.46 2.24 1.04 2.78.8.09-.63.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.9.98-2.56-.1-.25-.42-1.22.09-2.54 0 0 .8-.25 2.62.98a9.1 9.1 0 0 1 4.76 0c1.82-1.23 2.62-.98 2.62-.98.51 1.32.19 2.29.09 2.54.61.66.98 1.52.98 2.56 0 3.65-2.23 4.45-4.35 4.69.35.3.65.88.65 1.78v2.64c0 .26.17.56.66.46A9.5 9.5 0 0 0 21.5 12 9.5 9.5 0 0 0 12 2.5Z' />
                </svg>
              </a>
            </div>
            <a href={LINKS.privacy} target='_blank' rel='noreferrer'>
              Политика конфиденциальности
            </a>
            <a href={LINKS.agreement} target='_blank' rel='noreferrer'>
              Пользовательское соглашение
            </a>
            <a href={LINKS.consent} target='_blank' rel='noreferrer'>
              Согласие на обработку данных
            </a>
          </div>
        </div>
      </footer>

      {webModal && (
        <div className='modal-back'>
          <div
            className='modal'
            role='dialog'
            aria-modal='true'
            aria-label='Веб-версия в разработке'
          >
            <h3>Веб-версия в разработке</h3>
            <p>
              Мы сейчас переписываем веб-версию, поэтому она пока недоступна.
              Полностью работает мобильное приложение — установите его через
              RuStore или APK.
            </p>
            <div className='cta'>
              <button
                className='btn btn-primary'
                type='button'
                onClick={() => {
                  setWebModal(false)
                  document
                    .getElementById('download')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Скачать приложение
              </button>
              <button
                className='btn'
                type='button'
                onClick={() => setWebModal(false)}
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
