import {
  Icon20EducationOutline,
  Icon28BrainOutline,
  Icon28GraphOutline
} from '@vkontakte/icons'
import {
  Div,
  Group,
  Header,
  MiniInfoCell,
  Placeholder,
  SegmentedControl,
  SimpleCell
} from '@vkontakte/vkui'
import { type FC, useState } from 'react'

import { Mark } from '../../../../shared'
import { VIOLET } from '../../../../shared/config'
import {
  MarkDistribution,
  MarksTrend,
  SubjectAverages
} from './Charts'
import {
  buildCumulativeTrend,
  buildSubjectAverages,
  buildWeeklyTrend
} from './chartData'
import type { ISummary } from './types.ts'

import './index.css'

type TrendMode = 'cumulative' | 'weekly'

const TREND_OPTIONS = [
  { label: 'Накопительно', value: 'cumulative' },
  { label: 'По неделям', value: 'weekly' }
] as const

const Summary: FC<ISummary> = ({
  markCounts,
  totalNumberOfMarks,
  averageMark,
  marksForSubject
}) => {
  const [trendMode, setTrendMode] = useState<TrendMode>('cumulative')

  const subjectAverages = buildSubjectAverages(marksForSubject)
  const cumulativeTrend = buildCumulativeTrend(marksForSubject)
  const weeklyTrend = buildWeeklyTrend(marksForSubject)
  const trendPoints =
    trendMode === 'weekly' ? weeklyTrend : cumulativeTrend
  const best = subjectAverages[0]
  const worst =
    subjectAverages.length > 1
      ? subjectAverages[subjectAverages.length - 1]
      : null

  if (!markCounts && !subjectAverages.length && !cumulativeTrend.length) {
    return (
      <Group header={<Header size='m'>Статистика</Header>}>
        <Placeholder>Пока нет оценок для графиков</Placeholder>
      </Group>
    )
  }

  return (
    <div className='summaryTab'>
      <Group header={<Header size='m'>Статистика</Header>}>
        <MiniInfoCell
          before={<Icon20EducationOutline className='icon' />}
          after={
            <Mark color={VIOLET} size='s' mark={totalNumberOfMarks || 0} />
          }
        >
          Суммарное количество оценок:
        </MiniInfoCell>
        <MiniInfoCell
          before={
            <Icon28BrainOutline
              style={{ marginTop: 4 }}
              width={20}
              height={20}
            />
          }
          after={<Mark size='s' mark={averageMark || 0} />}
        >
          Общий средний балл:
        </MiniInfoCell>
        {best && (
          <SimpleCell
            before={<Icon28GraphOutline />}
            subtitle={best.name}
            after={best.average.toFixed(2)}
            multiline
          >
            Лучшая дисциплина
          </SimpleCell>
        )}
        {worst && worst.name !== best?.name && (
          <SimpleCell
            subtitle={worst.name}
            after={worst.average.toFixed(2)}
            multiline
          >
            Есть куда расти
          </SimpleCell>
        )}
        {markCounts && (
          <Div>
            <MarkDistribution markCounts={markCounts} />
          </Div>
        )}
      </Group>

      {cumulativeTrend.length >= 2 && (
        <Group
          header={<Header size='m'>Динамика среднего балла</Header>}
          description={
            trendMode === 'weekly'
              ? 'Средний балл за каждую неделю'
              : 'Как менялся общий средний с начала периода'
          }
        >
          <Div className='trendControls'>
            <SegmentedControl
              size='m'
              value={trendMode}
              onChange={(value) => setTrendMode(value as TrendMode)}
              options={[...TREND_OPTIONS]}
            />
          </Div>
          <Div>
            {trendPoints.length >= 2 ? (
              <MarksTrend
                points={trendPoints}
                ariaLabel={
                  trendMode === 'weekly'
                    ? 'Средний балл по неделям'
                    : 'Накопительный средний балл'
                }
              />
            ) : (
              <Placeholder>Недостаточно данных за недели</Placeholder>
            )}
          </Div>
        </Group>
      )}

      {subjectAverages.length > 0 && (
        <Group
          header={<Header size='m'>Рейтинг дисциплин</Header>}
          description={
            subjectAverages.length > 8
              ? 'Топ-5 и три самых сложных'
              : 'Средний балл по каждому предмету'
          }
        >
          <Div>
            <SubjectAverages subjects={subjectAverages} />
          </Div>
        </Group>
      )}
    </div>
  )
}

export default Summary
