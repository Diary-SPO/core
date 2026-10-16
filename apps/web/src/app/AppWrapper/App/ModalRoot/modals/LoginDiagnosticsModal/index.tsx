import {
  clearSavedCredentials,
  reloginWithSavedCredentials
} from '@runtime-api'
import {
  type LoginDiagnosticsReason,
  useDiaryRegion,
  useLoginDiagnostics
} from '@store'
import {
  Icon24CancelCircleFillRed,
  Icon24CheckCircleFillGreen,
  Icon24CopyOutline,
  Icon24ErrorCircle,
  Icon24Globe,
  Icon24Message,
  Icon24Refresh
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  ButtonGroup,
  Div,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  Progress,
  SimpleCell,
  Spinner,
  Text
} from '@vkontakte/vkui'
import { useEffect, useRef, useState } from 'react'
import { resetLoginFailCount } from '../../../../../../pages/LoginForm/diagnostics/failCounter'
import {
  DIAGNOSTIC_STEP_LABELS,
  type DiagnosticStepResult,
  type RegionProbe,
  runLoginDiagnostics
} from '../../../../../../pages/LoginForm/diagnostics/runDiagnostics'
import {
  buildSupportReport,
  openSupportChat,
  SUPPORT_URL
} from '../../../../../../pages/LoginForm/diagnostics/support'
import { saveData } from '../../../../../../pages/LoginForm/helpers'
import { clearAuthData, isApiError } from '../../../../../../shared'
import { getDiaryDomain } from '../../../../../../shared/config'

const stepIcon = (status: DiagnosticStepResult['status']) => {
  if (status === 'ok') return <Icon24CheckCircleFillGreen />
  if (status === 'fail') return <Icon24CancelCircleFillRed />
  return <Icon24ErrorCircle />
}

const LoginDiagnosticsModal = ({ id }: { id: string }) => {
  const routeNavigator = useRouteNavigator()
  const { reason, diaryUrl, detail, login, passwordHash, closeDiagnostics } =
    useLoginDiagnostics()
  const { selectRegion } = useDiaryRegion()

  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [steps, setSteps] = useState<DiagnosticStepResult[]>([])
  const [region, setRegion] = useState<RegionProbe | null>(null)
  const [currentLabel, setCurrentLabel] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [reloginWorking, setReloginWorking] = useState(false)
  const [reloginError, setReloginError] = useState<string | null>(null)
  const startedFor = useRef<LoginDiagnosticsReason | null>(null)

  const close = async () => {
    closeDiagnostics()
    await routeNavigator.hideModal()
  }

  const start = async () => {
    setPhase('running')
    setSteps([])
    setRegion(null)
    setCopied(false)
    setReloginError(null)
    let done = 0
    setCurrentLabel(DIAGNOSTIC_STEP_LABELS[0])
    const { steps: finished, region: probe } = await runLoginDiagnostics(
      { diaryUrl, login, passwordHash },
      (step) => {
        done += 1
        setSteps((prev) => [...prev, step])
        setCurrentLabel(DIAGNOSTIC_STEP_LABELS[done] ?? null)
      }
    )
    setSteps(finished)
    setRegion(probe)
    setCurrentLabel(null)
    setPhase('done')
  }

  useEffect(() => {
    if (!reason) {
      startedFor.current = null
      setPhase('idle')
      setSteps([])
      setRegion(null)
      setCurrentLabel(null)
      setReloginError(null)
      return
    }
    if (reason === 'repeated' || startedFor.current === reason) return
    startedFor.current = reason
    void start()
  }, [reason])

  const report = () =>
    reason
      ? buildSupportReport({ reason, diaryUrl, detail, steps, region })
      : ''

  const contactSupport = () => {
    void openSupportChat(report())
  }

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report())
      setCopied(true)
    } catch {
      // Буфер недоступен - отчёт всё равно уйдёт через ссылку в поддержку
      contactSupport()
    }
  }

  const switchRegion = async () => {
    if (!region?.foundUrl) return
    selectRegion(region.foundUrl)
    resetLoginFailCount()
    await close()
  }

  const relogin = async () => {
    if (reloginWorking) return
    setReloginWorking(true)
    setReloginError(null)
    try {
      const response = await reloginWithSavedCredentials()
      if (isApiError(response)) {
        if (response.status === 401) {
          // Сохранённый пароль больше не подходит - выходим по-настоящему.
          await clearSavedCredentials()
          clearAuthData()
          await close()
          await routeNavigator.replace('/')
          return
        }
        setReloginError('Не вышло, попробуйте позже')
        return
      }
      if (!response.data?.token) {
        setReloginError('Дневник ответил пустым, попробуйте позже')
        return
      }
      selectRegion(diaryUrl)
      saveData(response.data)
      resetLoginFailCount()
      window.location.reload()
    } catch {
      setReloginError('Не вышло, попробуйте позже')
    } finally {
      setReloginWorking(false)
    }
  }

  const openDiaryInBrowser = () => {
    window.open(diaryUrl || SUPPORT_URL, '_blank', 'noopener,noreferrer')
  }

  const failed = steps.filter((step) => step.status === 'fail')
  const domain = diaryUrl ? getDiaryDomain(diaryUrl) : ''

  return (
    <ModalPage id={id} size={520} dynamicContentHeight>
      <ModalPageHeader>Не получается войти</ModalPageHeader>
      {reason === 'repeated' && phase !== 'done' && (
        <Group>
          <Div>
            <Text>
              Мы заметили несколько неудачных попыток подряд. Чаще всего дело не
              в приложении, а в самом дневнике: неверный логин или пароль, либо
              дневник временно не принимает вход.
            </Text>
          </Div>
          <Div>
            <Text>
              Попробуйте войти через браузер на {domain || 'сайте дневника'}.
              Если там получается, а в приложении нет — напишите нам,
              разберёмся.
            </Text>
          </Div>
          <Div>
            <ButtonGroup mode='vertical' gap='s' stretched>
              <Button
                size='l'
                stretched
                before={<Icon24Globe />}
                onClick={openDiaryInBrowser}
              >
                Открыть дневник в браузере
              </Button>
              {phase === 'idle' && (
                <Button
                  size='l'
                  mode='secondary'
                  stretched
                  before={<Icon24Refresh />}
                  onClick={() => void start()}
                >
                  Запустить проверку
                </Button>
              )}
              <Button
                size='l'
                mode='secondary'
                stretched
                before={<Icon24Message />}
                onClick={contactSupport}
              >
                Написать в поддержку
              </Button>
              <Button
                size='m'
                mode='tertiary'
                stretched
                onClick={() => void close()}
              >
                Закрыть
              </Button>
            </ButtonGroup>
          </Div>
        </Group>
      )}
      {(reason !== 'repeated' || phase !== 'idle') && reason && (
        <Group
          header={
            <Header size='s'>
              {phase === 'running'
                ? `Проверяю: ${currentLabel ?? '…'}.`
                : 'Что проверили'}
            </Header>
          }
        >
          {(phase === 'running' || phase === 'done') && (
            <Div>
              <Progress
                value={(steps.length / DIAGNOSTIC_STEP_LABELS.length) * 100}
              />
            </Div>
          )}
          {steps.map((step) => (
            <SimpleCell
              key={step.id}
              before={stepIcon(step.status)}
              subtitle={step.detail}
              multiline
            >
              {step.label}
            </SimpleCell>
          ))}
          {phase === 'running' && currentLabel && (
            <SimpleCell
              before={<Spinner size='m' />}
              subtitle='Проверяю…'
              multiline
            >
              {currentLabel}
            </SimpleCell>
          )}
          {phase === 'done' && (
            <>
              {region?.foundUrl ? (
                <Div>
                  <Text>
                    Похоже, выбран не тот регион: вход прошёл в
                    {` «${region.foundName}»`}. Переключить?
                  </Text>
                </Div>
              ) : (
                <Div>
                  <Text>
                    {reason === 'session' && failed.length === 0
                      ? `Сессия дневника истекла, но всё остальное в порядке${login ? ` — можно войти заново как ${login}, пароль вводить не нужно` : ''}.`
                      : reason === 'shape'
                        ? 'Дневник ответил, но прислал данные, которые приложение не смогло разобрать. Это наша сторона — напишите нам, приложим исправление.'
                        : failed.length > 0
                          ? 'Нашли вероятную причину выше. Если дневник лежит — подождите и попробуйте позже, если всё зелёное — проверьте логин, пароль и регион.'
                          : 'Явной причины не нашли. Попробуйте войти через браузер — если там получается, напишите нам с отчётом ниже.'}
                    {detail ? ` (${detail})` : ''}
                  </Text>
                </Div>
              )}
              {reloginError && (
                <Div>
                  <Text>{reloginError}</Text>
                </Div>
              )}
              <Div>
                <ButtonGroup mode='vertical' gap='s' stretched>
                  {region?.foundUrl && (
                    <Button
                      size='l'
                      stretched
                      onClick={() => void switchRegion()}
                    >
                      Переключить на {region.foundName}
                    </Button>
                  )}
                  {reason === 'session' && login && failed.length === 0 && (
                    <Button
                      size='l'
                      stretched
                      disabled={reloginWorking}
                      onClick={() => void relogin()}
                    >
                      {reloginWorking
                        ? 'Вхожу заново…'
                        : `Войти заново как ${login}`}
                    </Button>
                  )}
                  <Button
                    size='l'
                    mode='secondary'
                    stretched
                    before={<Icon24Refresh />}
                    onClick={() => void start()}
                  >
                    Проверить ещё раз
                  </Button>
                  <Button
                    size='l'
                    mode='secondary'
                    stretched
                    before={<Icon24CopyOutline />}
                    onClick={() => void copyReport()}
                  >
                    {copied ? 'Отчёт скопирован' : 'Скопировать отчёт'}
                  </Button>
                  <Button
                    size='l'
                    stretched
                    before={<Icon24Message />}
                    onClick={contactSupport}
                  >
                    Написать в поддержку
                  </Button>
                  <Button
                    size='m'
                    mode='tertiary'
                    stretched
                    onClick={() => void close()}
                  >
                    Закрыть
                  </Button>
                </ButtonGroup>
              </Div>
            </>
          )}
        </Group>
      )}
    </ModalPage>
  )
}

export default LoginDiagnosticsModal
