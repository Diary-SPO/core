import { Button, ButtonGroup, Link, Placeholder } from '@vkontakte/vkui'
import { FC } from 'react'

const ErrorPlaceholder: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Placeholder
    header='Ошибка при загрузке'
    action={
      <ButtonGroup mode='vertical' align='center'>
        <Button size='s' onClick={() => onClick()}>
          Попробовать снова
        </Button>
        <Link href='https://vk.me/dnevnik_spo' target='_blank'>
          Сообщить о проблеме
        </Link>
      </ButtonGroup>
    }
  />
)

export default ErrorPlaceholder
