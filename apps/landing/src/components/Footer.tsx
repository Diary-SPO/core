import { LINKS } from '../config'
import { GithubIcon, VkIcon } from '../icons'

export function Footer() {
  return (
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
  )
}
