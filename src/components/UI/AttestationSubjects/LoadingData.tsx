import { useMemo } from 'react'
import { Div, Group, Header, Spinner } from '@vkontakte/vkui'

const LoadingData = () =>
  useMemo(
    () => (
      <Group header={<Header mode="tertiary">Загрузка...</Header>}>
        <Div>
          <Spinner />
        </Div>
      </Group>
    ),
    []
  )

export default LoadingData
