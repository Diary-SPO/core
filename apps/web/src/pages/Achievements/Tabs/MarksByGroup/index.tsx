import type { PerformanceCurrent } from '@diary-spo/shared'
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  Placeholder,
  Title
} from '@vkontakte/vkui'
import type { FC } from 'preact/compat'
import { createSubjectMarksMatrix } from '../../../../shared'

import AverageMarkCell from './AverageMarkCell'
import MarksList from './MarksList'

interface IMarksByGroup {
  marksForSubject: PerformanceCurrent
}

export const MarksByGroup: FC<IMarksByGroup> = ({ marksForSubject }) => {
  if (!marksForSubject) {
    return <Placeholder>Данных нет</Placeholder>
  }

  const subjectMarksMatrix = createSubjectMarksMatrix(marksForSubject)

  return (
    <Group
      className='tableWrapper'
      mode='plain'
      header={<Header mode='tertiary'>Оценки по дисциплинам</Header>}
    >
      {subjectMarksMatrix.map(({ subjectName, data }, i) => (
        <CardGrid key={i} size='l'>
          <Card mode='shadow'>
            <Div>
              {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
              <Title level='3' Component='h3'>
                {subjectName}
              </Title>
            </Div>

            <HorizontalScroll>
              <MarksList marks={data} />
            </HorizontalScroll>

            <AverageMarkCell marks={data.flatMap((item) => item.marks)} />
          </Card>
        </CardGrid>
      ))}
    </Group>
  )
}

export default MarksByGroup
