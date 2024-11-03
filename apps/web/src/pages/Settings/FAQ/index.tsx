import { Card, Group, Header } from '@vkontakte/vkui'
import type { FC } from 'react'

import { helpData } from './data.ts'

import HelpAccordion from './HelpAccordion.tsx'

const FAQ: FC = () => (
  <Group header={<Header mode='tertiary'>FAQ</Header>}>
    <Card mode='shadow'>
      {helpData.map(({ detail, title, id: dataId }) => (
        <HelpAccordion key={dataId} id={dataId} detail={detail} title={title} />
      ))}
    </Card>
  </Group>
)

export default FAQ
