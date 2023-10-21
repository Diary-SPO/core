import { FC } from 'react';
import {
  Card, CardGrid, Div, Group, Header, InfoRow, Subhead, Title,
} from '@vkontakte/vkui';
import { ExaminationType, Examinations } from 'diary-shared';

interface Subject {
  id: string;
  name: string;
  examinationType: ExaminationType;
  marks: Record<string, Record<string, string>>;
}

interface SubjectListProps {
  semesters: Record<string, Subject[]>;
  studentName: string | null;
  year: number | null;
}

const SubjectList: FC<SubjectListProps> = ({ semesters, studentName, year }) => (
  <div>
    {Object.keys(semesters).map((semesterKey) => (
      <Group
        key={semesterKey}
        header={(
          <Header
            mode='tertiary'
            aside={`${studentName}, ${year}`}
          >
            {semesterKey}
          </Header>
              )}
      >
        {semesters[semesterKey].map((subject) => (
          <CardGrid key={subject.id} size='l'>
            <Card mode='shadow'>
              <Div>
                <Title level='3'>{subject.name}</Title>
                <InfoRow header='Тип аттестации'>
                  <Subhead>{Examinations[subject.examinationType]}</Subhead>
                </InfoRow>
                <InfoRow header='Оценки'>
                  <Subhead>
                    {subject.marks[subject.id] && Object.keys(subject.marks[subject.id]).length > 0 ? (
                      Object.keys(subject.marks[subject.id]).map((studentId) => (
                          <span key={studentId}>
                              {subject.marks[subject.id][studentId]}
                            </span>
                        ))
                      ) : (
                        'Оценок нет'
                      )}
                  </Subhead>
                </InfoRow>
              </Div>
            </Card>
          </CardGrid>
        ))}
      </Group>
    ))}
  </div>
);

export default SubjectList;
