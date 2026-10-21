import {
  Icon16Dropdown,
  Icon24PlaceOutline,
  Icon28DoorArrowLeftOutline,
  Icon28ErrorCircleOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  FormItem,
  FormStatus,
  Group,
  Image,
  Input,
  Link,
  Panel
} from '@vkontakte/vkui'
import {
  type ChangeEvent,
  type FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { VIEW_SCHEDULE } from '../../app/routes'
import gosuslugiIcon from '../../assets/images/gosuslugi.svg'
import { handleResponse, isApiError, PanelHeaderWithBack } from '../../shared'
import { postEsiaLogin, postLogin } from '../../shared/api'
import { getToken } from '../../shared/api/token.ts'
import {
  DIARY_SOURCE,
  getDiaryDomain,
  getSortedDiaryRegions,
  MODAL_PAGE_LOGIN_DIAGNOSTICS,
  MODAL_PAGE_REGION,
  PERSONAL_DATA_CONSENT_URL,
  PRIVACY_POLICY_URL,
  USER_AGREEMENT_URL,
  VKUI_RED
} from '../../shared/config'
import { useSnackbar } from '../../shared/hooks'
import { useDiaryRegion } from '../../store/diaryRegion'
import { useLoginDiagnostics } from '../../store/loginDiagnostics'
import type { Props } from '../types.ts'
import {
  bumpLoginFailCount,
  resetLoginFailCount
} from './diagnostics/failCounter'
import { hashPassword, loginPattern, saveData } from './helpers'

import './index.css'

const LoginForm: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()

  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const passwordRef = useRef('')
  const getPassword = useCallback(() => passwordRef.current, [])

  const { selectedUrl: diaryUrl } = useDiaryRegion()
  const { openDiagnostics } = useLoginDiagnostics()

  const hasLegalDocuments = Boolean(
    PRIVACY_POLICY_URL && USER_AGREEMENT_URL && PERSONAL_DATA_CONSENT_URL
  )

  const [snackbar, showSnackbar] = useSnackbar()
  const diaryRegions = useMemo(() => getSortedDiaryRegions(), [])
  const selectedRegion = diaryRegions.find((region) => region.url === diaryUrl)
  const selectedRegionName = selectedRegion
    ? `${selectedRegion.name} (${getDiaryDomain(selectedRegion.url)})`
    : ''

  useLayoutEffect(() => {
    const getUserCookie = async () => {
      setIsLoading(true)
      const storageToken = localStorage.getItem('token') || getToken()

      if (!storageToken) {
        showSnackbar({
          before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
          subtitle: 'Заполни форму и войди в дневник',
          title: 'О вас нет данных, ты кто такой?'
        })
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
    }

    getUserCookie()
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    const setStateAction = {
      login: setLogin,
      password: setPassword
    }[name]
    setIsDataInvalid(false)
    setIsLoading(false)

    if (name === 'password') passwordRef.current = value
    setStateAction?.(value)
  }

  const readErrorDetails = (
    response: unknown
  ): { status: number; message: string | null } => {
    if (response instanceof Error) {
      const status = Number((response as { status?: unknown }).status ?? 0) || 0
      return { status, message: response.message }
    }
    if (!response || typeof response !== 'object') {
      return { status: 0, message: null }
    }
    const record = response as {
      status?: unknown
      error?: { status?: unknown; value?: unknown }
    }
    const status = Number(record.status ?? record.error?.status ?? 0) || 0
    const value = record.error?.value
    const message =
      value instanceof Error
        ? value.message
        : typeof value === 'string'
          ? value
          : null
    return { status, message }
  }

  const handleFailedAttempt = async (
    status: number,
    message: string | null,
    passwordHash?: string
  ) => {
    // Закрытый WebView Госуслуг — не ошибка, молча выходим.
    if (status === 499) return
    const fails = bumpLoginFailCount()
    const credentials = {
      login,
      passwordHash: passwordHash ?? null,
      getPassword
    }
    if (status === 502 && message?.startsWith('Login response')) {
      openDiagnostics({
        reason: 'shape',
        diaryUrl,
        detail: message,
        ...credentials
      })
      await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
      return
    }
    if (status === 401) {
      if (fails >= 3) {
        resetLoginFailCount()
        openDiagnostics({
          reason: 'repeated',
          diaryUrl,
          detail: message,
          ...credentials
        })
        await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
      }
      return
    }
    openDiagnostics({
      reason: 'network',
      diaryUrl,
      detail: message ?? `status ${status}`,
      ...credentials
    })
    await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
  }

  const handleLogin = async (e: ChangeEvent<HTMLFormElement>) => {
    setIsLoading(true)

    e.preventDefault()
    if (!loginPattern.test(login)) {
      setIsDataInvalid(true)
      return
    }

    const passwordHashed = await hashPassword(password)

    saveLegalAcceptance()

    try {
      const response = await postLogin(login, passwordHashed, true, diaryUrl)
      const { status, message } = readErrorDetails(response)
      const isShapeError =
        status === 502 && message?.startsWith('Login response')

      const handledResponse = handleResponse(
        response,
        () => {
          if (!isShapeError) setIsDataInvalid(true)
        },
        undefined,
        setIsLoading,
        showSnackbar,
        false,
        true
      )
      if (!handledResponse) {
        await handleFailedAttempt(status, message, passwordHashed)
        return
      }

      const { data } = handledResponse

      // @TODO: ??
      if (isApiError(data) || !data.token) {
        return
      }

      saveData(data)
      resetLoginFailCount()

      showSnackbar({
        title: 'Вхожу',
        subtitle: 'Подождите немного'
      })

      await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
    } catch (error) {
      console.error(error)
      const { status, message } = readErrorDetails(error)
      await handleFailedAttempt(status, message, passwordHashed)
    } finally {
      setIsLoading(false)
    }
  }

  const saveLegalAcceptance = () => {
    if (!hasLegalDocuments) return

    localStorage.setItem(
      'legalAcceptance',
      JSON.stringify({
        acceptedAt: new Date().toISOString(),
        personalDataConsentUrl: PERSONAL_DATA_CONSENT_URL,
        privacyPolicyUrl: PRIVACY_POLICY_URL,
        userAgreementUrl: USER_AGREEMENT_URL
      })
    )
  }

  const handleEsiaLogin = async () => {
    setIsLoading(true)
    saveLegalAcceptance()

    try {
      const response = await postEsiaLogin(diaryUrl)
      const handledResponse = handleResponse(
        response,
        () =>
          showSnackbar({
            before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
            title: 'Не удалось войти через Госуслуги',
            subtitle: 'Попробуйте ещё раз или войдите по логину и паролю'
          }),
        undefined,
        setIsLoading,
        showSnackbar,
        false,
        true
      )
      if (!handledResponse || isApiError(handledResponse.data)) {
        const { status, message } = readErrorDetails(response)
        await handleFailedAttempt(status, message)
        return
      }

      saveData(handledResponse.data)
      showSnackbar({
        title: 'Вхожу',
        subtitle: 'Авторизация через Госуслуги завершена'
      })
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
    } catch (error) {
      console.error(error)
      const { status, message } = readErrorDetails(error)
      await handleFailedAttempt(status, message)
      showSnackbar({
        before: <Icon28ErrorCircleOutline fill={VKUI_RED} />,
        title: 'Не удалось войти через Госуслуги',
        subtitle: 'Попробуйте ещё раз или войдите по логину и паролю'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isLoginEmpty = login === ''
  const isPasswordEmpty = password === ''
  const isPasswordValid = password && !isPasswordEmpty

  const loginTopText = isLoginEmpty
    ? 'Логин'
    : loginPattern.test(login)
      ? 'Логин введён'
      : 'Введите корректный логин'
  const passwordTopText =
    password === ''
      ? 'Пароль'
      : isPasswordValid
        ? 'Пароль введён'
        : 'Введите корректный пароль'

  const Banner = isDataInvalid ? (
    <FormStatus title='Некорректные данные' mode='error'>
      Проверьте правильность логина и пароля
    </FormStatus>
  ) : (
    <FormStatus
      title={
        DIARY_SOURCE === 'direct'
          ? 'Неофициальный клиент'
          : 'Нам можно доверять'
      }
      mode='default'
    >
      {DIARY_SOURCE === 'direct'
        ? 'Данные для входа передаются напрямую в электронный дневник. Приложение не сохраняет введённый пароль.'
        : 'Мы бережно передаем ваши данные и храним в зашифрованном виде'}
    </FormStatus>
  )

  const status = isLoginEmpty
    ? 'default'
    : loginPattern.test(login)
      ? 'valid'
      : 'error'
  const isDisabled =
    !password || !login || !loginPattern.test(login) || isLoading
  const isEsiaDisabled = isLoading

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Авторизация' />
      <Group>
        {Banner}
        <form method='post' onSubmit={handleLogin}>
          {DIARY_SOURCE === 'direct' && (
            <FormItem
              required
              top='Регион или город'
              bottom='Нажмите, чтобы выбрать регион'
            >
              <Input
                readOnly
                value={selectedRegionName}
                placeholder='Выберите регион'
                before={
                  selectedRegion ? (
                    <Image
                      size={24}
                      src={selectedRegion.emblem}
                      alt={selectedRegion.name}
                      borderRadius='s'
                      withTransparentBackground
                      noBorder
                    />
                  ) : (
                    <Icon24PlaceOutline />
                  )
                }
                after={<Icon16Dropdown />}
                onClick={() => routeNavigator.showModal(MODAL_PAGE_REGION)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    routeNavigator.showModal(MODAL_PAGE_REGION)
                  }
                }}
                aria-label='Выбрать регион дневника'
              />
            </FormItem>
          )}
          <FormItem
            required
            htmlFor='userLogin'
            top='Логин'
            status={status}
            bottom={isLoginEmpty || loginTopText}
            bottomId='login-type'
          >
            <Input
              required
              aria-labelledby='login-type'
              id='userLogin'
              type='text'
              name='login'
              placeholder='Введите логин'
              value={login}
              onChange={onChange}
            />
          </FormItem>
          <FormItem
            top='Пароль'
            htmlFor='pass'
            status={
              isPasswordEmpty ? 'default' : isPasswordValid ? 'valid' : 'error'
            }
            bottom={isPasswordEmpty || passwordTopText}
          >
            <Input
              name='password'
              id='pass'
              type='password'
              placeholder='Введите пароль'
              onChange={onChange}
            />
          </FormItem>
          <FormItem>
            <Button
              type='submit'
              size='l'
              stretched
              /*@TODO: ??*/
              onClick={handleLogin}
              disabled={isDisabled}
              before={<Icon28DoorArrowLeftOutline />}
            >
              {isLoading ? 'Пытаюсь войти...' : 'Войти'}
            </Button>
          </FormItem>
        </form>
        {DIARY_SOURCE === 'direct' && (
          <FormItem>
            <Button
              className='loginEsiaButton'
              type='button'
              size='l'
              stretched
              disabled={isEsiaDisabled}
              onClick={() => void handleEsiaLogin()}
            >
              <span className='loginEsiaButton__content'>
                <img src={gosuslugiIcon} alt='' aria-hidden />
                <span>Войти через Госуслуги</span>
              </span>
            </Button>
          </FormItem>
        )}
        {hasLegalDocuments && (
          <FormItem>
            <div className='loginLegalNotice'>
              Продолжая, вы принимаете{' '}
              <Link href={USER_AGREEMENT_URL} target='_blank' rel='noreferrer'>
                пользовательское соглашение
              </Link>
              , подтверждаете, что ознакомились с{' '}
              <Link href={PRIVACY_POLICY_URL} target='_blank' rel='noreferrer'>
                политикой конфиденциальности
              </Link>
              , и даёте{' '}
              <Link
                href={PERSONAL_DATA_CONSENT_URL}
                target='_blank'
                rel='noreferrer'
              >
                согласие на обработку персональных данных
              </Link>
              .
            </div>
          </FormItem>
        )}
        {snackbar}
      </Group>
    </Panel>
  )
}

export default LoginForm
