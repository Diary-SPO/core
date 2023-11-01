import { Group, Header, MiniInfoCell } from '@vkontakte/vkui'
import { Icon20EducationOutline, Icon28BrainOutline } from '@vkontakte/icons'
import { FC } from 'preact/compat'
import Mark from './Mark'
import { Grade } from 'diary-shared'

interface ISummary {
  totalNumberOfMarks: number | null
  averageMark: number | null
  markCounts: Record<keyof typeof Grade, number> | null
}

const Summary: FC<ISummary> = ({
  markCounts,
  totalNumberOfMarks,
  averageMark,
}) => (
  <Group header={<Header mode="tertiary">Статистика</Header>}>
    <MiniInfoCell
      before={<Icon20EducationOutline style={{ marginTop: 4 }} />}
      after={<Mark size="s" mark={totalNumberOfMarks} />}
    >
      Суммарное количество оценок:
    </MiniInfoCell>
    <MiniInfoCell
      before={
        <Icon28BrainOutline style={{ marginTop: 4 }} width={20} height={20} />
      }
      after={<Mark size="s" mark={averageMark.toFixed(2)} />}
    >
      Общий средний балл:
    </MiniInfoCell>
    {markCounts && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-around',
          gap: 5,
        }}
      >
        {Object.keys(markCounts).map(
          (mark) =>
            markCounts[mark] > 0 && (
              <MiniInfoCell
                key={mark}
                before={<Mark mark={Grade[mark]} size="s" />}
              >
                x {markCounts[mark]}
              </MiniInfoCell>
            )
        )}
      </div>
    )}
  </Group>
)

export default Summary
