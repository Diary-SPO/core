import { appUpdater } from '@runtime-api'
import { Icon24DownloadOutline } from '@vkontakte/icons'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  ButtonGroup,
  Div,
  ModalPage,
  ModalPageHeader,
  Progress,
  Text,
  Title
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

import { RUSTORE_APP_URL } from '../../../../../../shared/config'
import {
  APP_UPDATE_PROMPT_EVENT,
  type AppUpdatePromptDetail,
  peekPendingAppUpdatePrompt,
  takePendingAppUpdatePrompt
} from '../../../../../../shared/utils/appUpdate'

import './index.css'

const AppUpdateModal = ({ id }: { id: string }) => {
  const routeNavigator = useRouteNavigator()
  const { modal: activeModal } = useActiveVkuiLocation()
  const [prompt, setPrompt] = useState<AppUpdatePromptDetail | null>(() =>
    peekPendingAppUpdatePrompt()
  )
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const syncPrompt = (detail?: AppUpdatePromptDetail | null) => {
      const next = detail ?? peekPendingAppUpdatePrompt()
      if (next) setPrompt(next)
    }

    const onPrompt = (event: Event) => {
      syncPrompt((event as CustomEvent<AppUpdatePromptDetail>).detail)
    }

    window.addEventListener(APP_UPDATE_PROMPT_EVENT, onPrompt)
    if (activeModal === id) syncPrompt()

    return () => window.removeEventListener(APP_UPDATE_PROMPT_EVENT, onPrompt)
  }, [activeModal, id])

  useEffect(() => {
    return appUpdater.subscribe((status) => {
      setProgress(status.progress)
      if (status.lastError) setError(status.lastError)
    })
  }, [])

  const close = async () => {
    takePendingAppUpdatePrompt()
    setBusy(false)
    setError(null)
    setProgress(null)
    await routeNavigator.hideModal()
  }

  const onLater = async () => {
    if (prompt && prompt.reason !== 'debug') appUpdater.dismiss()
    await close()
  }

  const onUpdate = async () => {
    if (!prompt) return
    if (prompt.reason === 'native') {
      window.open(RUSTORE_APP_URL, '_blank', 'noopener,noreferrer')
      await close()
      return
    }

    if (prompt.reason === 'debug' && !prompt.update.url) {
      await close()
      return
    }

    setBusy(true)
    setError(null)
    try {
      if (prompt.reason === 'ready') {
        await appUpdater.apply()
        return
      }
      await appUpdater.download()
      await appUpdater.apply()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить')
      setBusy(false)
    }
  }

  const version =
    prompt?.reason === 'ready' ? prompt.version : prompt?.update.version || '—'

  const notes =
    prompt?.reason === 'ready'
      ? 'Обновление уже скачано и готово к установке.'
      : prompt?.update.notes ||
        'Можно посмотреть, как выглядит экран обновления.'

  const isNative = prompt?.reason === 'native'
  const isReady = prompt?.reason === 'ready'
  const isDebugPreview = prompt?.reason === 'debug' && !prompt.update.url

  const title = !prompt
    ? 'Обновление'
    : isNative
      ? 'Нужно обновить приложение'
      : isReady
        ? 'Обновление готово'
        : isDebugPreview
          ? 'Предпросмотр обновления'
          : 'Доступно обновление'

  const primaryLabel = isNative
    ? 'Открыть RuStore'
    : isReady
      ? 'Установить'
      : isDebugPreview
        ? 'Понятно'
        : busy
          ? 'Загрузка…'
          : 'Обновить'

  return (
    <ModalPage
      id={id}
      size={520}
      dynamicContentHeight
      onClose={() => void onLater()}
    >
      <ModalPageHeader>Обновление</ModalPageHeader>
      <div className='appUpdateModal__hero'>
        <div className='appUpdateModal__badge'>v{version}</div>
        <Text className='appUpdateModal__channel'>
          {isNative
            ? 'Требуется версия из магазина'
            : isDebugPreview
              ? 'Демо без реального обновления'
              : 'Обновление интерфейса'}
        </Text>
      </div>
      <Div className='appUpdateModal__content'>
        <Title
          className='appUpdateModal__title'
          level='2'
          weight='2'
          Component='h2'
        >
          {title}
        </Title>
        <Text className='appUpdateModal__description'>{notes}</Text>
        {busy && progress != null && (
          <div className='appUpdateModal__progress'>
            <Progress value={progress} />
            <Text className='appUpdateModal__progressLabel'>
              {Math.round(progress)}%
            </Text>
          </div>
        )}
        {error && <Text className='appUpdateModal__error'>{error}</Text>}
        <ButtonGroup mode='vertical' gap='s' stretched>
          <Button
            size='l'
            stretched
            before={
              !isNative && !isDebugPreview ? (
                <Icon24DownloadOutline />
              ) : undefined
            }
            loading={busy}
            onClick={() => void onUpdate()}
          >
            {primaryLabel}
          </Button>
          {!isDebugPreview && (
            <Button
              size='l'
              mode='secondary'
              stretched
              disabled={busy}
              onClick={() => void onLater()}
            >
              Позже
            </Button>
          )}
        </ButtonGroup>
      </Div>
    </ModalPage>
  )
}

export default AppUpdateModal
