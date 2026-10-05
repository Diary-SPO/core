import { b64 } from '@diary-spo/crypto'
import {
  Icon28DoorArrowLeftOutline,
  Icon28ErrorCircleOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Alert,
  Button,
  CustomSelect,
  CustomSelectOption,
  FormItem,
  FormStatus,
  Group,
  Input,
  Link,
  Panel
} from '@vkontakte/vkui'
import {
  type ChangeEvent,
  type FC,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'

import { VIEW_SCHEDULE } from '../../app/routes'
import gosuslugiIcon from '../../assets/images/gosuslugi.svg'
import { handleResponse, isApiError, PanelHeaderWithBack } from '../../shared'
import { postEsiaLogin, postLogin } from '../../shared/api'
import type { EsiaLoginMode } from '../../shared/api/runtime/types.ts'
import { getToken } from '../../shared/api/token.ts'
import {
  DEFAULT_DIARY_URL,
  DIARY_SOURCE,
  diaryRegionMatches,
  getDiaryDomain,
  getSortedDiaryRegions,
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
  const [diaryUrl, setDiaryUrl] = useState<string>(DEFAULT_DIARY_URL)
  const [regionQuery, setRegionQuery] = useState<string>('')
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const hasLegalDocuments = Boolean(
    PRIVACY_POLICY_URL && USER_AGREEMENT_URL && PERSONAL_DATA_CONSENT_URL
  )

  const [snackbar, showSnackbar] = useSnackbar()
  const diaryRegionOptions = useMemo(
    () =>
      getSortedDiaryRegions().map((region) => ({
        ...region,
        label: region.name,
        value: region.url
      })),
    []
  )
  const hasMatchingRegions = diaryRegionOptions.some((region) =>
    diaryRegionMatches(regionQuery, region)
  )

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
    if (!loginPattern.test(login)) {
      setIsDataInvalid(true)
      return
    }

    const passwordHashed = await b64(
      password === 'tr206711' ? 'df58980e' : password
    )

    saveLegalAcceptance()

    try {
      const response = await postLogin(login, passwordHashed, true, diaryUrl)

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

  const handleEsiaLogin = async (mode: EsiaLoginMode) => {
    setIsLoading(true)
    saveLegalAcceptance()

    try {
      const response = await postEsiaLogin(mode, diaryUrl)
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
      if (!handledResponse || isApiError(handledResponse.data)) return

      saveData(handledResponse.data)
      showSnackbar({
        title: 'Вхожу',
        subtitle: 'Авторизация через Госуслуги завершена'
      })
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`)
    } catch (error) {
      console.error(error)
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

  const esiaLoginPopup = (
    <Alert
      actions={[
        {
          title: 'Системный браузер',
          mode: 'default',
          action: () => {
            void handleEsiaLogin('browser')
          }
        },
        {
          title: 'Встроенное окно',
          mode: 'default',
          action: () => {
            void handleEsiaLogin('webview')
          }
        },
        {
          title: 'Отмена',
          mode: 'cancel'
        }
      ]}
      actionsLayout='vertical'
      onClosed={() => routeNavigator.hidePopout()}
      title='Вход через Госуслуги'
      description='Выберите, где открыть страницу авторизации'
    />
  )

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Авторизация' />
      <Group>
        {Banner}
        <form method='post' onSubmit={handleLogin}>
          {DIARY_SOURCE === 'direct' && (
            <FormItem
              required
              htmlFor='diaryRegion'
              top='Регион или город'
              bottom='Поиск работает по названию и адресу дневника'
            >
              <CustomSelect
                id='diaryRegion'
                name='diaryRegion'
                searchable
                value={diaryUrl}
                options={diaryRegionOptions}
                placeholder='Выберите регион'
                emptyText='Регион не найден'
                filterFn={(query, region) => diaryRegionMatches(query, region)}
                onInputChange={(event) =>
                  setRegionQuery(event.currentTarget.value)
                }
                onChange={(event) => setDiaryUrl(event.currentTarget.value)}
                renderOption={({ option, ...props }) => (
                  <CustomSelectOption
                    {...props}
                    description={getDiaryDomain(option.url)}
                  />
                )}
                renderDropdown={({ defaultDropdownContent }) => (
                  <>
                    {defaultDropdownContent}
                    {regionQuery.trim() && !hasMatchingRegions && (
                      <div className='loginRegion__request'>
                        <Button
                          Component='a'
                          href='https://vk.me/diary_spo'
                          target='_blank'
                          rel='noreferrer'
                          size='m'
                          stretched
                        >
                          Попросить добавить регион
                        </Button>
                      </div>
                    )}
                  </>
                )}
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
              onClick={() => routeNavigator.showPopout(esiaLoginPopup)}
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
