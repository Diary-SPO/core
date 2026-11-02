import { Icon28DoorArrowRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Alert, CellButton, Group } from '@vkontakte/vkui'
import { clearAuthData, logOut } from '../../shared'
import { useSnackbar } from '../../shared/hooks'

const LogoutButton = () => {
  const routeNavigator = useRouteNavigator()
  const [snackbar, showSnackbar] = useSnackbar()

  const handleLogOut = async () => {
    showSnackbar({
      title: 'Выход',
      before: (
        <Icon28DoorArrowRightOutline color='var(--vkui--color_background_accent_themed)' />
      ),
      subtitle: 'После удаления всех данных вы попадёте на страницу авторизации'
    })

    clearAuthData()
    try {
      await routeNavigator.replace('/')
    } catch (error) {
      console.error('Error during logout navigation:', error)
    }
    try {
      await logOut()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

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
      onClosed={() => routeNavigator.hidePopout()}
      title='Выход'
      description='Вы уверены, что хотите выйти из аккаунта?'
    />
  )

  return (
    <Group>
      <CellButton
        appearance='negative'
        before={<Icon28DoorArrowRightOutline />}
        onClick={() => routeNavigator.showPopout(logOutPopup)}
      >
        Выйти
      </CellButton>
      {snackbar}
    </Group>
  )
}

export default LogoutButton
