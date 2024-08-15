import { Div, Group, Header, Spinner } from '@vkontakte/vkui'
import type { FC } from 'react'

interface Props {
  text?: string
}

const LoadingData: FC<Props> = ({ text }) => (
  <Group header={<Header mode='tertiary'>{text ?? 'Загрузка...'}</Header>}>
    <Div>
      <Spinner />
    </Div>
  </Group>
)

export default LoadingData
