import type { FC } from 'react'

import { PageSkeleton } from '../../shared/ui'

/** text оставлен для совместимости вызовов */
const LoadingData: FC<{ text?: string }> = () => <PageSkeleton cards={3} />

export default LoadingData
