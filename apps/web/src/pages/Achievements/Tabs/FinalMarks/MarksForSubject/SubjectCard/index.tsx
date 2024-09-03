import { Icon20CheckAlt } from '@vkontakte/icons'
import {
  Card,
  CardGrid,
  Div,
  HorizontalCell,
  MiniInfoCell,
  Title
} from '@vkontakte/vkui'
import type { FC } from 'react'

import { Mark } from '../../../../../../shared'
import type { Term, TermMark } from '../types.ts'

import { MarkWithPopover } from './MarkWithPopover'

import './index.css'

export const SubjectCard: FC<{
  subjectName: string
  finalMark: TermMark
  terms: Term[]
}> = ({ subjectName, finalMark, terms }) => (
  <CardGrid size='l'>
    <Card mode='shadow'>
      <Div>
        <Title level='3' Component='h3'>
          {subjectName}
        </Title>
      </Div>
      <HorizontalCell className='terms'>
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
