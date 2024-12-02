import { Icon24Filter } from '@vkontakte/icons'
import {
  Counter,
  Group,
  Header,
  SubnavigationBar,
  SubnavigationButton,
  VisuallyHidden
} from '@vkontakte/vkui'
import type { FC } from 'react'

interface Props {
  openModal: () => void
}

const filters: FC<Props> = ({ openModal }) => {
  return (
    <>
      <Group header={<Header mode='tertiary'>Фильтры</Header>}>
        <SubnavigationBar>
          <SubnavigationButton
            before={<Icon24Filter />}
            selected={true}
            chevron
            after={
              <Counter size='s'>
                <VisuallyHidden>Применено: </VisuallyHidden>
                {0}
              </Counter>
            }
            onClick={openModal}
          >
            Фильтры
          </SubnavigationButton>
        </SubnavigationBar>
      </Group>
    </>
  )
}

export default filters
