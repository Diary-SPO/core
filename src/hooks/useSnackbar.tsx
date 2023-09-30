import React, { ReactNode, useCallback, useState } from 'react';
import { Snackbar, SnackbarProps } from '@vkontakte/vkui';
import { Icon28InfoCircleOutline } from '@vkontakte/icons';

export interface SnackbarData {
  layout?: SnackbarProps['layout'];
  icon?: ReactNode;
  action?: string;
  onActionClick?: () => void;
  onClose?: () => void;
  duration?: number;
  style?: React.CSSProperties;
  title: string;
  subtitle?: string;
}

const useSnackbar = (): [ReactNode | null, (snackbarData: SnackbarData | null) => void] => {
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const showSnackbar = useCallback((snackbarData: SnackbarData | null) => {
    if (!snackbarData) {
      setSnackbar(null);
      return null;
    }

    setSnackbar(
      <Snackbar
        layout={snackbarData.layout || 'vertical'}
        onClose={() => setSnackbar(null)}
        before={snackbarData.icon || <Icon28InfoCircleOutline fill='var(--vkui--color_background_accent)' />}
        action={snackbarData.action}
        onActionClick={snackbarData.onActionClick}
        duration={snackbarData.duration}
        style={snackbarData.style}
        subtitle={snackbarData.subtitle}
      >
        {snackbarData.title}
      </Snackbar>,
    );

    return null;
  }, []);

  return [snackbar, showSnackbar];
};

export default useSnackbar;
