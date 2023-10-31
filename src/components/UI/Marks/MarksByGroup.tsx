import { FC } from 'react'
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  Title,
} from '@vkontakte/vkui'
import { PerformanceCurrent } from 'diary-shared'
import { createSubjectMarksMap } from '../../../utils'
import MarksList from './MarksList'
import AverageMarkCell from './AverageMarkCell'
import NoData from './NoData'

interface IMarksByGroup {
  marksForSubject: PerformanceCurrent | null
}

const MarksByGroup: FC<IMarksByGroup> = ({ marksForSubject }) => {
  if (!marksForSubject) {
    return NoData
  }

  const subjectMarksMap = createSubjectMarksMap(marksForSubject)

  return (
    <Group
      mode="plain"
      header={<Header mode="secondary">Оценки по дисциплинам</Header>}
    >
      {Object.keys(subjectMarksMap).map((subjectName, i) => (
        <CardGrid key={i} size="l">
          <Card mode="shadow">
            <Div>
              {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
              <Title level="3">{subjectName}</Title>
            </Div>
            <HorizontalScroll>
              <MarksList marks={subjectMarksMap[subjectName]} />
            </HorizontalScroll>
            <AverageMarkCell
              averageMark={
                marksForSubject.daysWithMarksForSubject[i].averageMark as number
              }
              marks={subjectMarksMap[subjectName].flatMap(({ marks }) => marks)}
            />
          </Card>
        </CardGrid>
      ))}
    </Group>
  )
}

export default MarksByGroup
