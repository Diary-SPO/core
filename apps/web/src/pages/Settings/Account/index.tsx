import { useDiaryRegion, useLoginDiagnostics } from '@store'
import {
  Icon28DeleteOutline,
  Icon28ErrorCircleOutline,
  Icon28HomeArrowDownOutline,
  Icon28PlaceOutline
} from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { CellButton, Group, Header, Panel, SimpleCell } from '@vkontakte/vkui'
import { type FC, useEffect, useMemo, useState } from 'react'
import { PanelHeaderWithBack } from '../../../shared'
import {
  MODAL_PAGE_LOGIN_DIAGNOSTICS,
  MODAL_PAGE_REGION
} from '../../../shared/config'
import {
  DIARY_REGIONS,
  getDiaryDomain
} from '../../../shared/config/diary-regions.ts'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import { clearAppCache } from '../shared/clearCache'

const AccountSettings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const { selectedUrl } = useDiaryRegion()
  const { openDiagnostics } = useLoginDiagnostics()
  const [snackbar, showSnackbar] = useSnackbar()
  const [isHomeScreenSupported, setIsHomeScreenSupported] = useState(false)

  const selectedRegion = useMemo(
    () => DIARY_REGIONS.find((region) => region.url === selectedUrl),
    [selectedUrl]
  )

  const regionLabel = selectedRegion
    ? `${selectedRegion.name} (${getDiaryDomain(selectedRegion.url)})`
    : getDiaryDomain(selectedUrl)

  useEffect(() => {
    bridge
      .send('VKWebAppAddToHomeScreenInfo')
      .then(({ is_feature_supported }) => {
        if (is_feature_supported) setIsHomeScreenSupported(true)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const clearCache = () => {
    const removed = clearAppCache()
    showSnackbar({
      title: 'Кеш очищен',
      subtitle:
        removed > 0
          ? `Удалено записей: ${removed}. Данные подтянутся при следующем открытии экранов.`
          : 'Сохранённых данных не нашлось'
    })
  }

  const openDiagnosticsModal = async () => {
    openDiagnostics({
      reason: 'network',
      diaryUrl: selectedUrl,
      detail: 'Диагностика из настроек аккаунта',
      login: null,
      passwordHash: null,
      getPassword: null
    })
    await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
  }

  const addToHomeScreen = () => {
    bridge
      .send('VKWebAppAddToHomeScreen')
      .then((data) => {
        if (data.result) console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Аккаунт' />
      <Group header={<Header size='s'>Регион</Header>}>
        <SimpleCell
          before={<Icon28PlaceOutline />}
          subtitle={regionLabel}
          onClick={() => void routeNavigator.showModal(MODAL_PAGE_REGION)}
          multiline
        >
          Регион дневника
        </SimpleCell>
      </Group>
      <Group header={<Header size='s'>Данные</Header>}>
        <CellButton before={<Icon28DeleteOutline />} onClick={clearCache}>
          Очистить кеш
        </CellButton>
        <CellButton
          before={<Icon28ErrorCircleOutline />}
          onClick={() => void openDiagnosticsModal()}
        >
          Диагностика входа
        </CellButton>
        {isHomeScreenSupported && (
          <CellButton
            before={<Icon28HomeArrowDownOutline />}
            onClick={addToHomeScreen}
          >
            Добавить на экран
          </CellButton>
        )}
      </Group>
      {snackbar}
    </Panel>
  )
}

export default AccountSettings
