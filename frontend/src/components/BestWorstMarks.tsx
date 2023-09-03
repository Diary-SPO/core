import { CSSProperties, useEffect, useState } from 'react';
import {
  Div, Group, Header, HorizontalCell, HorizontalScroll, Spinner,
} from '@vkontakte/vkui';
import Mark from './Mark.tsx';
import { IMark } from '../../../shared';
import { getMarks } from '../methods';

const infoStyle: CSSProperties = {
  display: 'flex',
};

const cells: CSSProperties = {
  maxWidth: '100%',
  display: 'flex',
  gap: 5,
};

const cellStyle: CSSProperties = {
  maxWidth: 'unset',
  overflowWrap: 'break-word',
};

const BestWorstMarks = () => {
  const [marks, setMarks] = useState<IMark | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const truncateString = (str: string, maxLength: number) => {
    if (str.length <= maxLength) {
      return str;
    }
    return `${str.slice(0, maxLength - 3)}...`;
  };

  useEffect(() => {
    setIsLoading(true);
    const gettedMarks = async () => {
      try {
        const data = await getMarks();
        setIsLoading(false);
        setMarks(data);
      } catch (error) {
        setIsLoading(false);
        console.error('Ошибка при получении оценок:', error);
      }
    };
    gettedMarks();
  }, []);

  return (
    <Group header={<Header mode='tertiary'>Предметы с лучшим средним баллом</Header>} description={marks === null ? 'Оценок нет, но вы держитесь' : ''}>
      <HorizontalScroll
        showArrows
        style={infoStyle}
      >
        <div style={cells}>
          {marks?.subjects?.length! > 0 && marks?.subjects?.map(({ mark, name, id }) => {
            const matchResult = name.match(/^[^.]+(\.\S+)?/);
            const headerText = matchResult ? matchResult[0] : '';

            return (
              <HorizontalCell
                key={id}
                header={truncateString(headerText, 26)}
                style={cellStyle}
              >
                <Mark mark={mark} />
              </HorizontalCell>
            );
          })}
          {isLoading && (
            <Div>
              <Spinner />
            </Div>
          )}
        </div>
      </HorizontalScroll>
    </Group>
  );
};

export default BestWorstMarks;
