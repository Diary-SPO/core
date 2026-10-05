import { useEffect } from 'react'

interface WebModalProps {
  onClose: () => void
}

export function WebModal({ onClose }: WebModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const goDownload = () => {
    onClose()
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
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
          Полностью работает мобильное приложение — установите его через RuStore
          или APK.
        </p>
        <div className='cta'>
          <button
            className='btn btn-primary'
            type='button'
            onClick={goDownload}
          >
            Скачать приложение
          </button>
          <button className='btn' type='button' onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  )
}
