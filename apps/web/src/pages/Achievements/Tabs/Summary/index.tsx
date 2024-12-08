import { Icon20EducationOutline, Icon28BrainOutline } from '@vkontakte/icons'
import { Flex, Group, Header, MiniInfoCell } from '@vkontakte/vkui'
import type { FC } from 'react'

import UserInfo from './UserInfo'
import type { ISummary } from './types.ts'

import './index.css'
import { Mark } from '../../../../shared'
import { VIOLET } from '../../../../shared/config'

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
        {/*@TODO: ??*/}
        <>
          <MiniInfoCell
            before={<Icon20EducationOutline className='icon' />}
            after={
              <Mark color={VIOLET} size='s' mark={totalNumberOfMarks || 0} />
            }
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
            after={<Mark size='s' mark={averageMark || 0} />}
          >
            Общий средний балл:
          </MiniInfoCell>
          {markCounts && (
            <Flex justify='space-evenly'>
              {[5, 4, 3, 2].map(
                (mark) =>
                  markCounts[mark] > 0 && (
                    <MiniInfoCell
                      key={mark}
                      before={<Mark mark={mark} size='s' />}
                      style={{ minWidth: 70 }}
                    >
                      x {markCounts[mark]}
                    </MiniInfoCell>
                  )
              )}
            </Flex>
          )}
        </>
      </Group>
    </>
  )
}

export default Summary
