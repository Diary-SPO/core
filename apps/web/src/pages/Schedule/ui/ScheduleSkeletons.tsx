import { Skeleton } from '@vkontakte/vkui'
import type { FC } from 'react'

export const RecentMarksSkeleton: FC = () => (
  <div className='recentMarks'>
    <div className='diary-marks-skeleton'>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className='diary-marks-skeleton__item'>
          <Skeleton width={40} height={12} borderRadius={4} />
          <Skeleton width={72} height={72} borderRadius={12} />
          <Skeleton width={72} height={28} borderRadius={6} />
        </div>
      ))}
    </div>
  </div>
)

export const ScheduleGroupSkeleton: FC = () => (
  <div className='diary-schedule-skeleton'>
    <Skeleton height={132} borderRadius={12} />
    <Skeleton height={168} borderRadius={12} />
    <Skeleton height={120} borderRadius={12} />
  </div>
)
