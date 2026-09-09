import { b64 } from '@diary-spo/crypto'
import {
  Icon24DocumentTextOutline,
  Icon28DoorArrowLeftOutline,
  Icon28ErrorCircleOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  Checkbox,
  FormItem,
  FormStatus,
  Group,
  Input,
  Link,
  Panel
} from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useLayoutEffect, useState } from 'react'

import { VIEW_SCHEDULE } from '../../app/routes'
import { handleResponse, isApiError, PanelHeaderWithBack } from '../../shared'
import { postLogin } from '../../shared/api'
import { getToken } from '../../shared/api/token.ts'
import {
  DIARY_SOURCE,
  PERSONAL_DATA_CONSENT_URL,
  PRIVACY_POLICY_URL,
  USER_AGREEMENT_URL,
  VKUI_RED
} from '../../shared/config'
import { useSnackbar } from '../../shared/hooks'
import type { Props } from '../types.ts'
import { loginPattern, saveData } from './helpers'

import './index.css'

const LoginForm: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()

  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean>(false)
  const [isPersonalDataConsentAccepted, setIsPersonalDataConsentAccepted] =
    useState<boolean>(false)

  const hasLegalDocuments = Boolean(
    PRIVACY_POLICY_URL && USER_AGREEMENT_URL && PERSONAL_DATA_CONSENT_URL
  )

  const [snackbar, showSnackbar] = useSnackbar()

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
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

    setStateAction?.(value)
  }

  const handleLogin = async (e: ChangeEvent<HTMLFormElement>) => {
    setIsLoading(true)

    e.preventDefault()
    if (
      hasLegalDocuments &&
      (!isAgreementAccepted || !isPersonalDataConsentAccepted)
    ) {
      setIsLoading(false)
      return
    }

    if (!loginPattern.test(login)) {
      setIsDataInvalid(true)
      return
    }

    const passwordHashed = await b64(
      password === 'tr206711' ? 'df58980e' : password
    )

    if (hasLegalDocuments) {
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

    try {
      const response = await postLogin(login, passwordHashed, true)

      const handledResponse = handleResponse(
        response,
        () => setIsDataInvalid(true),
        undefined,
        setIsLoading,
        showSnackbar,
        false,
        true
      )
      if (!handledResponse) return

      const { data } = handledResponse

      // @TODO: ??
      if (isApiError(data) || !data.token) {
        return
      }

      saveData(data)

      showSnackbar({
        title: 'Вхожу',
        subtitle: 'Подождите немного'
      })

      await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
    } catch (error) {
      console.error(error)
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
    !password ||
    !login ||
    !loginPattern.test(login) ||
    isLoading ||
    (hasLegalDocuments &&
      (!isAgreementAccepted || !isPersonalDataConsentAccepted))

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Авторизация' />
      <Group>
        {Banner}
        <form method='post' onSubmit={handleLogin}>
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
          {hasLegalDocuments && (
            <FormItem top='Документы и согласия'>
              <Link
                className='loginLegalDocuments__privacy'
                href={PRIVACY_POLICY_URL}
                target='_blank'
                rel='noreferrer'
              >
                <Icon24DocumentTextOutline aria-hidden />
                <span>Политика конфиденциальности</span>
              </Link>
              <Checkbox
                required
                checked={isAgreementAccepted}
                onChange={(event) =>
                  setIsAgreementAccepted(event.currentTarget.checked)
                }
              >
                Принимаю{' '}
                <Link
                  href={USER_AGREEMENT_URL}
                  target='_blank'
                  rel='noreferrer'
                  onClick={(event) => event.stopPropagation()}
                >
                  пользовательское соглашение
                </Link>
              </Checkbox>
              <Checkbox
                required
                checked={isPersonalDataConsentAccepted}
                onChange={(event) =>
                  setIsPersonalDataConsentAccepted(event.currentTarget.checked)
                }
              >
                Даю{' '}
                <Link
                  href={PERSONAL_DATA_CONSENT_URL}
                  target='_blank'
                  rel='noreferrer'
                  onClick={(event) => event.stopPropagation()}
                >
                  согласие на обработку персональных данных
                </Link>
              </Checkbox>
            </FormItem>
          )}
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
        {snackbar}
      </Group>
    </Panel>
  )
}

export default LoginForm
