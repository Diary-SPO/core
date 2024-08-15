import { PanelSpinner } from '@vkontakte/vkui'
import type { ComponentType, FC, ReactNode } from 'react'

type WithLoadingProps = {
  shouldShowSpinner: boolean
  fallback?: ReactNode
}

export const withSpinner =
  <P extends object>(
    WrappedComponent: ComponentType<P>
  ): FC<P & WithLoadingProps> =>
  ({ shouldShowSpinner, fallback, ...props }: WithLoadingProps & P) => {
    if (shouldShowSpinner) {
      return <>{fallback || <PanelSpinner />}</>
    }

    return <WrappedComponent {...(props as P)} />
  }
