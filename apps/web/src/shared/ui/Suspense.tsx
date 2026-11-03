import { ScreenSpinner } from '@vkontakte/vkui'
import { type FC, type ReactNode, Suspense as ReactSuspense } from 'react'

import { PageSkeleton } from './PageSkeleton'

interface ISuspense {
  children: ReactNode
  id: string
  size?: 's' | 'm' | 'l' | 'xl'
  mode?: 'panel' | 'screen' | 'default'
}

export const Suspense: FC<ISuspense> = ({ children, id, mode = 'panel' }) => (
  <ReactSuspense
    key={id}
    fallback={
      mode === 'screen' ? <ScreenSpinner label='Загрузка' /> : <PageSkeleton />
    }
  >
    {children}
  </ReactSuspense>
)
