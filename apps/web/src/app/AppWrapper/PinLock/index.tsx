import { Title } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

import {
  APP_PIN_LENGTH,
  isPinEnabled,
  isPinUnlocked,
  lockPinSession,
  PIN_LOCK_EVENT,
  PIN_UNLOCK_EVENT,
  unlockPinSession,
  verifyPin
} from '../../../pages/Settings/shared/pin'

import './index.css'

const keys = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '',
  '0',
  '⌫'
] as const

const PinLock = () => {
  const [locked, setLocked] = useState(() => isPinEnabled() && !isPinUnlocked())
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const sync = () => setLocked(isPinEnabled() && !isPinUnlocked())
    window.addEventListener(PIN_LOCK_EVENT, sync)
    window.addEventListener(PIN_UNLOCK_EVENT, sync)
    return () => {
      window.removeEventListener(PIN_LOCK_EVENT, sync)
      window.removeEventListener(PIN_UNLOCK_EVENT, sync)
    }
  }, [])

  useEffect(() => {
    // Свернули приложение - при возврате снова спрашиваем пинкод.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && isPinEnabled()) {
        lockPinSession()
        setValue('')
        setError('')
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (value.length !== APP_PIN_LENGTH) return

    void (async () => {
      const ok = await verifyPin(value)
      if (!ok) {
        setError('Неверный пинкод')
        setValue('')
        return
      }
      setError('')
      setValue('')
      unlockPinSession()
      setLocked(false)
    })()
  }, [value])

  if (!locked) return null

  const press = (key: (typeof keys)[number]) => {
    setError('')
    if (key === '') return
    if (key === '⌫') {
      setValue((prev) => prev.slice(0, -1))
      return
    }
    setValue((prev) => (prev.length >= APP_PIN_LENGTH ? prev : `${prev}${key}`))
  }

  return (
    <div
      className='pinLock'
      role='dialog'
      aria-modal='true'
      aria-label='Пинкод'
    >
      <Title level='2' weight='2' style={{ textAlign: 'center' }}>
        Введите пинкод
      </Title>
      <div className='pinLock__dots' aria-hidden>
        {Array.from({ length: APP_PIN_LENGTH }, (_, index) => (
          <span
            key={index}
            className={`pinLock__dot${value.length > index ? ' pinLock__dot--filled' : ''}`}
          />
        ))}
      </div>
      <div className='pinLock__error'>{error}</div>
      <div className='pinLock__pad'>
        {keys.map((key, index) => (
          <button
            key={`${key}-${index}`}
            type='button'
            className='pinLock__key'
            disabled={key === ''}
            onClick={() => press(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PinLock
