import { useEffect, useRef, useState } from 'react'
import { LINKS } from './config'

const FEATURES = [
  {
    color: '#e5482f',
    accent: '#ffd9d2',
    title: 'Наглядное расписание на неделю',
    text: 'Пары по дням: время, корпус, кабинет, преподаватель. Листайте неделю и возвращайтесь кнопкой «Домой».',
    img: './screenshots/c5e36473-c17c-4498-a6c7-2ed8a39ed2d1.png',
    alt: 'Экран расписания на неделю в приложении Дневник СПО'
  },
  {
    color: '#0a9b4d',
    accent: '#d3f2df',
    title: 'Подробная информация о паре',
    text: 'Предмет, тип занятия, аудитория, время и успеваемость — всё в карточке «Подробнее о паре».',
    img: './screenshots/27c5c34a-29ec-4312-a0bd-28e2a5b83684.png',
    alt: 'Карточка подробной информации о паре'
  },
  {
    color: '#3b3bbf',
    accent: '#dedeff',
    title: 'Детальная статистика успеваемости',
    text: 'Общий и средний балл, количество оценок, текущие и итоговые. Видно, что подтянуть.',
    img: './screenshots/e80be220-99a5-4d95-ba2a-a33655437481.png',
    alt: 'Экран статистики успеваемости студента'
  },
  {
    color: '#9333ea',
    accent: '#ecd9ff',
    title: 'Объявления в один клик',
    text: 'Графики занятий, переносы и новости колледжа без похода в браузер Сетевого города.',
    img: './screenshots/ae1458f6-5c94-40b3-9eb0-5896aac1a3ab.png',
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
    q: 'Сколько стоит? Есть ли реклама?',
    a: 'Бесплатно, без рекламы и встроенных покупок.'
  },
  {
    q: 'Почему меня просят принять соглашения?',
    a: 'Перед входом нужно принять политику конфиденциальности и пользовательское соглашение — так требуют правила публикации.'
  }
]

function RuStoreIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M5 8h14l-1.2 8.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
      <path
        d='M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

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
  const [copied, setCopied] = useState(false)
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
    if (!webModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWebModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [webModal])

  const copyApk = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.apk)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
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
          <a className='btn btn-sm btn-primary' href='#download'>
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
                  <RuStoreIcon /> Скачать в RuStore
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
              <dl className='hero-stats'>
                <div>
                  <dt>Все регионы</dt>
                  <dd>выбор портала на входе</dd>
                </div>
                <div>
                  <dt>Расписание</dt>
                  <dd>неделя и кабинеты</dd>
                </div>
                <div>
                  <dt>Оценки</dt>
                  <dd>и уведомления</dd>
                </div>
              </dl>
            </div>
            <div className='hero-visual reveal'>
              <img
                src='./cat.webp'
                alt='Котик — маскот приложения Дневник СПО'
                fetchPriority='high'
              />
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
              style={{ background: feature.accent }}
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
                  <RuStoreIcon /> RuStore
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
              <button className='copy-link' type='button' onClick={copyApk}>
                <CopyIcon />{' '}
                {copied ? 'Ссылка скопирована!' : 'Скопировать ссылку на APK'}
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
            <a href={LINKS.vk} target='_blank' rel='noreferrer'>
              Поддержка VK
            </a>
            <a href={LINKS.privacy}>Политика конфиденциальности</a>
            <a href={LINKS.agreement}>Пользовательское соглашение</a>
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
