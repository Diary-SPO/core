import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'

const PanelHeaderWithBack: FunctionalComponent<{ title: string }> = ({
  title
}) => {
  const routeNavigator = useRouteNavigator()

  return (
    <PanelHeader
      before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
    >
      {title}
    </PanelHeader>
  )
}

export default PanelHeaderWithBack
