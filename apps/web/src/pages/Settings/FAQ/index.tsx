import { Card, Group, Header } from '@vkontakte/vkui'
import type { FunctionComponent } from 'preact'
import { lazy } from 'preact/compat'

import { Suspense } from '../../../shared/ui'

import { helpData } from './data.ts'

const HelpAccordion = lazy(() => import('./HelpAccordion.tsx'))

const FAQ: FunctionComponent = () => (
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
