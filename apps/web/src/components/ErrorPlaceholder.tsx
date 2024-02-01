import { Button, ButtonGroup, Link, Placeholder } from '@vkontakte/vkui'
import { FC } from 'react'

export const ErrorPlaceholder: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Placeholder
    header='Ошибка при загрузке'
    action={
      <ButtonGroup mode='vertical' align='center'>
        {/*// @ts-ignore Типы не совместимы */}
        <Button size='s' onClick={() => onClick()}>
          Попробовать снова
        </Button>
        {/*// @ts-ignore Типы не совместимы */}
        <Link href='https://vk.me/dnevnik_spo' target='_blank'>
          Сообщить о проблеме
        </Link>
      </ButtonGroup>
    }
  />
)
