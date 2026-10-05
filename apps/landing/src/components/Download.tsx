import { useState } from 'react'
import { LINKS } from '../config'
import { ApkIcon, CopyIcon, WebIcon } from '../icons'

interface DownloadProps {
  onWebClick: () => void
}

export function Download({ onWebClick }: DownloadProps) {
  const [copied, setCopied] = useState<'ok' | 'err' | null>(null)

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

  return (
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
              onClick={onWebClick}
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
  )
}
