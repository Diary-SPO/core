import { LINKS } from '../config'
import {
  ApkIcon,
  CalendarIcon,
  GlobeIcon,
  MegaphoneIcon,
  TrendIcon,
  WebIcon
} from '../icons'

interface HeroProps {
  onWebClick: () => void
}

export function Hero({ onWebClick }: HeroProps) {
  return (
    <section className='hero'>
      <div className='hero-bg' aria-hidden='true' />
      <div className='container hero-grid'>
        <div className='reveal'>
          <p className='badge'>
            <span className='badge-dot' /> Неофициальный клиент Сетевого города
            · Android
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
              onClick={onWebClick}
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
            <GlobeIcon />
          </span>
          <dt>Все регионы</dt>
          <dd>выбор портала Сетевого города на экране входа</dd>
        </div>
        <div>
          <span className='stat-icon' aria-hidden='true'>
            <CalendarIcon />
          </span>
          <dt>Расписание на неделю</dt>
          <dd>пары, кабинеты, преподаватели, кнопка «Домой»</dd>
        </div>
        <div>
          <span className='stat-icon' aria-hidden='true'>
            <TrendIcon />
          </span>
          <dt>Оценки и статистика</dt>
          <dd>текущие, итоговые, средний балл, уведомления</dd>
        </div>
        <div>
          <span className='stat-icon' aria-hidden='true'>
            <MegaphoneIcon />
          </span>
          <dt>Объявления колледжа</dt>
          <dd>графики занятий и новости в один клик</dd>
        </div>
      </dl>
    </section>
  )
}
