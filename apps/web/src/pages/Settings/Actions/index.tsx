import {
  Icon28DoorArrowRightOutline,
  Icon28HomeArrowDownOutline,
  Icon28IncognitoOutline
} from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Alert, CellButton, Group, Header, Switch } from '@vkontakte/vkui'
import { useEffect, useRef, useState } from 'preact/hooks'

import { logOut } from '../../../shared'
import { useSnackbar } from '../../../shared/hooks'

import TechInfo from './TechInfo.tsx'

const Actions = () => {
  const routeNavigator = useRouteNavigator()
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false)
  const switchRef = useRef(null)

  const [snackbar, showSnackbar] = useSnackbar()
  const [isHomeScreenSupported, setIsHomeScreenSupported] =
    useState<boolean>(false)

  const logOutPopup = (
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoCloseDisabled: false,
          mode: 'cancel'
        },
        {
          title: 'Выйти',
          autoCloseDisabled: false,
          mode: 'destructive',
          action: () => handleLogOut()
        }
      ]}
      actionsLayout='horizontal'
      onClose={() => routeNavigator.hidePopout()}
      header='Выход'
      text='Вы уверены, что хотите выйти из аккаунта?'
    />
  )

  const handleLogOut = () => {
    showSnackbar({
      title: 'Выход',
      before: (
        //@ts-ignore типы React не совсем совместимы с Preact
        <Icon28DoorArrowRightOutline color='var(--vkui--color_background_accent_themed)' />
      ),
      subtitle: 'После удаления всех данных вы попадёте на страницу авторизации'
    })

    setTimeout(async () => {
      try {
        await logOut()
        await routeNavigator.replace('/')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }, 1500)
  }

  const addToHomeScreen = () => {
    bridge
      .send('VKWebAppAddToHomeScreen')
      .then((data) => {
        if (data.result) {
          console.log(data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    const checkIsFeatureSupported = async () => {
      await bridge
        .send('VKWebAppAddToHomeScreenInfo')
        // eslint-disable-next-line camelcase
        .then(({ is_feature_supported }) => {
          // eslint-disable-next-line camelcase
          if (is_feature_supported) {
            setIsHomeScreenSupported(true)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }

    checkIsFeatureSupported()
  }, [])

  return (
    <>
      <Group header={<Header mode='secondary'>Действия</Header>}>
        {/*// @ts-ignore Типы не совместимы */}
        <CellButton
          Component='label'
          //@ts-ignore типы React не совсем совместимы с Preact
          after={<Switch getRef={switchRef} />}
          onChange={() => setIsSwitchChecked(!isSwitchChecked)}
          before={<Icon28IncognitoOutline />}
        >
          Показывать тех. информацию
        </CellButton>
        {/*// @ts-ignore Типы не совместимы */}
        <CellButton
          before={<Icon28DoorArrowRightOutline />}
          onClick={() => routeNavigator.showPopout(logOutPopup)}
        >
          Выйти
        </CellButton>
        {isHomeScreenSupported && (
          // @ts-ignore Типы не совместимы
          <CellButton
            before={<Icon28HomeArrowDownOutline />}
            onClick={addToHomeScreen}
          >
            Добавить на экран
          </CellButton>
        )}

        {snackbar}
      </Group>
      {isSwitchChecked && <TechInfo />}
    </>
  )
}

export default Actions
