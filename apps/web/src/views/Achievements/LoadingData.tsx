import { Div, Group, Header, Spinner } from '@vkontakte/vkui'
import { useMemo } from 'preact/compat'

const LoadingData = () =>
  useMemo(
    () => (
      <Group header={<Header mode='tertiary'>Загрузка...</Header>}>
        <Div>
          <Spinner />
        </Div>
      </Group>
    ),
    []
  )

export default LoadingData
