import { LINKS } from '../config'
import { GithubIcon, VkIcon } from '../icons'
import { publicUrl, withBase } from '../lib/site'

interface FooterProps {
  /** На главной якорь #top, на остальных страницах ссылка на главную */
  homeHref?: string
}

export function Footer({ homeHref = '#top' }: FooterProps) {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footer-bento'>
          <div className='footer-brand'>
            <a className='footer-brand-link' href={homeHref}>
              <img src={publicUrl('icon.png')} alt='' aria-hidden='true' />
              <span className='footer-brand-text'>
                <b>Дневник СПО</b>
                <p>
                  Независимый проект. Не является официальным приложением
                  Сетевого города и АО «ИРТех».
                </p>
              </span>
            </a>
            <div className='socials'>
              <a
                href={LINKS.vk}
                target='_blank'
                rel='noreferrer'
                aria-label='Группа Дневника СПО во VK'
              >
                <span className='sr-only'>Группа Дневника СПО во VK</span>
                <VkIcon />
              </a>
              <a
                href={LINKS.github}
                target='_blank'
                rel='noreferrer'
                aria-label='Исходный код на GitHub'
              >
                <span className='sr-only'>Исходный код на GitHub</span>
                <GithubIcon />
              </a>
            </div>
          </div>

          <nav className='footer-col' aria-label='Приложение'>
            <h2 className='footer-col-title'>Приложение</h2>
            <a href={withBase('skachat/')}>Скачать</a>
            <a href={withBase('vhod/')}>Как войти</a>
            <a href={withBase('vhod-cherez-gosuslugi/')}>
              Вход через Госуслуги
            </a>
            <a href={withBase('regions/')}>Все регионы</a>
          </nav>

          <nav className='footer-col' aria-label='Помощь'>
            <h2 className='footer-col-title'>Помощь</h2>
            <a href={withBase('dnevnik-spo-ne-otkryvaetsya/')}>
              Не открывается
            </a>
            <a href={withBase('dnevnik-spo-oshibka-zaprosa/')}>
              Ошибка запроса
            </a>
            <a href={withBase('dnevnik-spo-ne-rabotaet/')}>Не работает</a>
          </nav>

          <nav className='footer-col' aria-label='Документы'>
            <h2 className='footer-col-title'>Документы</h2>
            <a href={LINKS.privacy} target='_blank' rel='noreferrer'>
              Политика конфиденциальности
            </a>
            <a href={LINKS.agreement} target='_blank' rel='noreferrer'>
              Пользовательское соглашение
            </a>
            <a href={LINKS.consent} target='_blank' rel='noreferrer'>
              Согласие на обработку данных
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
