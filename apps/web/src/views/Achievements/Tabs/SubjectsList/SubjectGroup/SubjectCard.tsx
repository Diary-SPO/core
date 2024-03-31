import { Examinations, type Subject } from '@diary-spo/shared'
import { Card, CardGrid, Div, InfoRow, Subhead, Title } from '@vkontakte/vkui'
import type { FunctionalComponent } from 'preact'

export interface ISubjectCard {
  subject: Subject
}

const SubjectCard: FunctionalComponent<ISubjectCard> = ({ subject }) => (
  <CardGrid key={subject.id} size='l'>
    <Card mode='shadow'>
      <Div>
        {/*// @ts-ignore*/}
        <Title level='3' Component='h3'>
          {subject.name}
        </Title>
        <InfoRow header='Тип аттестации'>
          {/*// @ts-ignore*/}
          <Subhead Component='h5'>
            {Examinations[subject.examinationType]}
          </Subhead>
        </InfoRow>
        <InfoRow header='Оценки'>
          {/*// @ts-ignore*/}
          <Subhead Component='h5'>
            {/*// TODO: перенести в функцию*/}
            {subject.marks[subject.id] &&
            Object.keys(subject.marks[subject.id]).length > 0
              ? Object.keys(subject.marks[subject.id]).map((studentId) => (
                  <span key={studentId}>
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
