import { FC } from 'react';
import {
  Div, Group, Header, MiniInfoCell,
} from '@vkontakte/vkui';
import { Icon20EducationOutline, Icon28BrainOutline } from '@vkontakte/icons';
import Mark from './Mark';

const Summary: FC = () => {
  const getItemFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const totalNumberOfMarks = getItemFromLocalStorage('totalNumberOfMarks');
  const averageMark = getItemFromLocalStorage('averageMark');
  const markCounts = getItemFromLocalStorage('markCounts');

  return (
    <Group header={<Header mode='tertiary'>Статистика</Header>}>
      <Div>
        <MiniInfoCell
          before={<Icon20EducationOutline style={{ marginTop: 4 }} />}
          after={<Mark size='s' mark={totalNumberOfMarks} />}
        >
          Суммарное количество оценок:
        </MiniInfoCell>
        <MiniInfoCell
          before={<Icon28BrainOutline style={{ marginTop: 4 }} width={20} height={20} />}
          after={<Mark size='s' mark={averageMark} />}
        >
          Общий средний балл:
        </MiniInfoCell>
      </Div>
      {markCounts && (
        <div style={{
          display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-around', gap: 5,
        }}
        >
          {[2, 3, 4, 5].map((mark) => (
            markCounts[mark] > 0 && (
              <MiniInfoCell
                before={<Mark mark={mark} size='s' />}
              >
                x
                {' '}
                {markCounts[mark]}
              </MiniInfoCell>
            )
          ))}
        </div>
      )}
    </Group>
  );
};

export default Summary;
