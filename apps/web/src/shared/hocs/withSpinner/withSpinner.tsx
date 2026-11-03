import type { ComponentType } from 'react'

import { PageSkeleton } from '../../ui/PageSkeleton'

interface WithLoadingProps {
  shouldShowSpinner: boolean
  fallback?: React.ReactNode
}

export const withSpinner =
  <P extends object>(WrappedComponent: ComponentType<P>) =>
  ({ shouldShowSpinner, fallback, ...props }: WithLoadingProps & P) => {
    if (shouldShowSpinner) {
      return <>{fallback || <PageSkeleton />}</>
    }

    return <WrappedComponent {...(props as P)} />
  }
