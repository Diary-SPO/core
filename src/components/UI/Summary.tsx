import { Icon20EducationOutline, Icon28BrainOutline } from '@vkontakte/icons'
import { Group, Header, MiniInfoCell } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import React from 'preact/compat'
import Mark from './Mark'

interface ISummary {
  totalNumberOfMarks: number | null
  averageMark: number | null
  markCounts: Record<number, number> | null
}

const Summary: FC<ISummary> = ({
  markCounts,
  totalNumberOfMarks,
  averageMark
}) => (
  <Group
    header={
      <Header mode='tertiary'>
        Статистика {!markCounts && 'отсутствует'}{' '}
      </Header>
    }
  >
    {!markCounts ? undefined : (
      <React.Fragment>
        <MiniInfoCell
          before={<Icon20EducationOutline style={{ marginTop: 4 }} />}
          after={<Mark size='s' mark={totalNumberOfMarks} />}
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
          after={<Mark size='s' mark={averageMark} />}
        >
          Общий средний балл:
        </MiniInfoCell>
        {markCounts && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'space-around',
              gap: 5
            }}
          >
            {[2, 3, 4, 5].map(
              (mark) =>
                markCounts[mark] > 0 && (
                  <MiniInfoCell
                    key={mark}
                    before={<Mark mark={mark} size='s' />}
                  >
                    x {markCounts[mark]}
                  </MiniInfoCell>
                )
            )}
          </div>
        )}
      </React.Fragment>
    )}
  </Group>
)

export default Summary
