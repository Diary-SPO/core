import { Card, Group, Header } from '@vkontakte/vkui'
import type { FC } from 'react'

import { Suspense } from '../../../shared/ui'
import { helpData } from './data.ts'

import HelpAccordion from './HelpAccordion.tsx'

const FAQ: FC = () => (
  <Group header={<Header mode='tertiary'>FAQ</Header>}>
    <Card mode='shadow'>
      <Suspense id='HelpAccordion'>
        {helpData.map(({ detail, title, id: dataId }) => (
          <HelpAccordion
            key={dataId}
            id={dataId}
            detail={detail}
            title={title}
          />
        ))}
      </Suspense>
    </Card>
  </Group>
)

export default FAQ
