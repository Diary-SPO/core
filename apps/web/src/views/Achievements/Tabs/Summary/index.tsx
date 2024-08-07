import { Mark } from '@components'
import { VIOLET } from '@config'
import { Icon20EducationOutline, Icon28BrainOutline } from '@vkontakte/icons'
import { Group, Header, MiniInfoCell } from '@vkontakte/vkui'
import { type FC, Fragment } from 'preact/compat'
import UserInfo from './UserInfo'
import type { ISummary } from './types.ts'

import './index.css'

const Summary: FC<ISummary> = ({
  markCounts,
  totalNumberOfMarks,
  averageMark
}) => {
  return (
    <>
      <UserInfo />

      <Group
        header={
          <Header mode='tertiary'>
            Статистика {!markCounts && 'отсутствует'}
          </Header>
        }
      >
        <Fragment>
          <MiniInfoCell
            before={<Icon20EducationOutline className='icon' />}
            after={<Mark color={VIOLET} size='s' mark={totalNumberOfMarks} />}
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
            <div className='marksCount'>
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
        </Fragment>
      </Group>
    </>
  )
}

export default Summary
