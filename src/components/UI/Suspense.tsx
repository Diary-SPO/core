import { PanelSpinner, ScreenSpinner, Spinner } from '@vkontakte/vkui';
import { Suspense as ReactSuspense, FC, ReactNode } from 'preact/compat';

interface ISpinner {
  size?: 'small' | 'regular' | 'medium' | 'large',
  mode?: 'panel' | 'screen' | 'default',
}

interface ISuspense extends ISpinner {
  children: ReactNode,
  id: string,
}

const SpinnerWrapper: FC<ISpinner> = ({ size, mode }) => {
  switch (mode) {
    case 'panel':
      return <PanelSpinner size={size} />;
    case 'screen':
      return <ScreenSpinner size={size} />;
    case 'default':
    default:
      return <Spinner size={size} />;
  }
};

const Suspense: FC<ISuspense> = ({
  children, size = 'regular', id, mode = 'panel',
}) => (
  <ReactSuspense key={id} fallback={<SpinnerWrapper size={size} mode={mode} />}>
    {children}
  </ReactSuspense>
);

export default Suspense;
