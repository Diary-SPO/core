import { PanelSpinner, ScreenSpinner, Spinner } from '@vkontakte/vkui'
import { type FC, type ReactNode, Suspense as ReactSuspense } from 'react'

interface ISpinner {
  size?: 's' | 'm' | 'l' | 'xl'
  mode?: 'panel' | 'screen' | 'default'
}

interface ISuspense extends ISpinner {
  children: ReactNode
  id: string
}

const SpinnerWrapper: FC<ISpinner> = ({ size, mode }) => {
  switch (mode) {
    case 'panel':
      return <PanelSpinner size={size} />
    case 'screen':
      return <ScreenSpinner label='Загрузка' />
    default:
      return <Spinner size={size} />
  }
}

export const Suspense: FC<ISuspense> = ({
  children,
  size = 'm',
  id,
  mode = 'panel'
}) => (
  <ReactSuspense key={id} fallback={<SpinnerWrapper size={size} mode={mode} />}>
    {children}
  </ReactSuspense>
)
