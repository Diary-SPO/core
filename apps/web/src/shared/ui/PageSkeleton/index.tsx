import { Div, Skeleton } from '@vkontakte/vkui'
import type { FC } from 'react'

import './index.css'

interface PageSkeletonProps {
  /** Карточки-заглушки под контент экрана. */
  cards?: number
}

/** Универсальный skeleton для экранов во время загрузки. */
export const PageSkeleton: FC<PageSkeletonProps> = ({ cards = 3 }) => (
  <Div className='diary-page-skeleton'>
    {Array.from({ length: cards }, (_, index) => (
      <Skeleton key={index} height={index === 0 ? 88 : 128} borderRadius={12} />
    ))}
  </Div>
)

export const ProfileSkeleton: FC = () => (
  <Div className='diary-page-skeleton diary-page-skeleton--profile'>
    <Skeleton width={96} height={96} borderRadius='50%' />
    <Skeleton width={160} height={22} borderRadius={8} />
    <Skeleton width={120} height={16} borderRadius={6} />
    <Skeleton height={72} borderRadius={12} />
  </Div>
)

export const NotificationsSkeleton: FC = () => (
  <Div className='diary-page-skeleton'>
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className='diary-page-skeleton__notify'>
        <Skeleton width='55%' height={18} borderRadius={6} />
        <Skeleton width='35%' height={12} borderRadius={4} />
        <Skeleton height={56} borderRadius={8} />
      </div>
    ))}
  </Div>
)
