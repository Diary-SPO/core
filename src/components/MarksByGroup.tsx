import { FC } from 'react'
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  MiniInfoCell,
  Title,
} from '@vkontakte/vkui'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline,
} from '@vkontakte/icons'
import {
  AbsenceTypes,
  AbsenceTypesKeys,
  Grade,
  PerformanceCurrent,
} from 'diary-shared'
import Mark from './UI/Mark'
import {
  ReturnedMark,
  calculateAverageMark,
  createSubjectMarksMap,
} from '../utils'

interface IMarksByGroup {
  marksForSubject: PerformanceCurrent | null
}

const NoData = (
  <Group
    mode="plain"
    header={<Header mode="secondary">Оценки по дисциплинам</Header>}
  >
    <CardGrid size="l">
      <Card mode="shadow">
        <Div>
          {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
          <Title level="3">Нет данных</Title>
        </Div>
      </Card>
    </CardGrid>
  </Group>
)

const NoMarks = (
  <MiniInfoCell before={<Icon20IncognitoOutline />}>Нет оценок</MiniInfoCell>
)

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
              <div style={{ display: 'flex' }}>
                {subjectMarksMap[subjectName].map(
                  ({ date, marks, absenceType }) => (
                    <div
                      key={`${date}_${absenceType}`}
                      style={{ display: 'flex' }}
                    >
                      {marks.length > 0 && !absenceType ? (
                        marks.map((mark, k) => (
                          <Mark
                            key={k}
                            mark={Grade[mark] as ReturnedMark}
                            size="s"
                          />
                        ))
                      ) : absenceType ? (
                        <Mark
                          size="s"
                          mark={AbsenceTypes[absenceType] as AbsenceTypesKeys}
                        />
                      ) : null}
                    </div>
                  )
                )}
              </div>
            </HorizontalScroll>
            {marksForSubject.daysWithMarksForSubject[i].averageMark ? (
              <MiniInfoCell
                textWrap="full"
                before={<Icon20StatisticsOutline />}
                style={{ marginTop: 5 }}
                after={calculateAverageMark(
                  subjectMarksMap[subjectName].flatMap(({ marks }) => marks)
                )}
              >
                Средний балл:
              </MiniInfoCell>
            ) : (
              NoMarks
            )}
          </Card>
        </CardGrid>
      ))}
    </Group>
  )
}

export default MarksByGroup
