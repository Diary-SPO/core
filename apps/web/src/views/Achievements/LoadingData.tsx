import { Div, Group, Header, Spinner } from '@vkontakte/vkui'
import { FC, useMemo } from 'preact/compat'

interface Props {
  text?: string
}

const LoadingData: FC<Props> = ({ text }) =>
  useMemo(
    () => (
      <Group header={<Header mode='tertiary'>{text ?? 'Загрузка...'}</Header>}>
        <Div>
          <Spinner />
        </Div>
      </Group>
    ),
    []
  )

export default LoadingData
