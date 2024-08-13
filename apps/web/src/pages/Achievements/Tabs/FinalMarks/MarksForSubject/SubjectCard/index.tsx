import { Icon20CheckAlt } from '@vkontakte/icons'
import {
  Card,
  CardGrid,
  Div,
  HorizontalCell,
  MiniInfoCell,
  Title
} from '@vkontakte/vkui'
import type { FC } from 'preact/compat'

import { MarkWithPopover } from './MarkWithPopover'

import type { Term, TermMark } from '../types.ts'

import './index.css'
import { Mark } from '../../../../../../shared/ui'

export const SubjectCard: FC<{
  subjectName: string
  finalMark: TermMark
  terms: Term[]
}> = ({ subjectName, finalMark, terms }) => (
  <CardGrid size='l' mode='plain'>
    <Card mode='shadow'>
      <Div>
        {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
        <Title level='3' Component='h3'>
          {subjectName}
        </Title>
      </Div>
      {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
      <HorizontalCell>
        {terms
          .filter(({ mark }) => mark !== '')
          .map((term) => (
            <MarkWithPopover
              key={`${term.course}-${term.semester}`}
              term={term}
            />
          ))}
      </HorizontalCell>
      <MiniInfoCell
        textWrap='full'
        className='totalMark'
        before={<Icon20CheckAlt />}
        after={finalMark ? <Mark size='s' mark={finalMark} /> : 'отсутствует'}
      >
        Итоговая оценка:
      </MiniInfoCell>
    </Card>
  </CardGrid>
)
