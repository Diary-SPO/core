import { Examinations, type Subject } from '@diary-spo/shared'
import { Card, CardGrid, Div, InfoRow, Subhead, Title } from '@vkontakte/vkui'
import type { FC } from 'react'

export interface ISubjectCard {
  subject: Subject
}

const SubjectCard: FC<ISubjectCard> = ({ subject }) => (
  <CardGrid key={subject.id} size='l'>
    <Card mode='shadow'>
      <Div>
        <Title level='3' Component='h3'>
          {subject.name}
        </Title>
        <InfoRow header='Тип аттестации'>
          <Subhead Component='h5'>
            {/*@TODO: ??*/}
            {Examinations[subject.examinationType]}
          </Subhead>
        </InfoRow>
        <InfoRow header='Оценки'>
          <Subhead Component='h5'>
            {/*// TODO: перенести в функцию*/}
            {subject.marks[subject.id] &&
            Object.keys(subject.marks[subject.id]).length > 0
              ? Object.keys(subject.marks[subject.id]).map((studentId) => (
                  <span key={studentId}>
                    {/*@TODO: ??*/}
                    {subject.marks[subject.id][studentId]}
                  </span>
                ))
              : 'Оценок нет'}
          </Subhead>
        </InfoRow>
      </Div>
    </Card>
  </CardGrid>
)

export default SubjectCard
