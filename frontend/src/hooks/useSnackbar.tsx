import React, { useState, ReactNode } from 'react';
import { Snackbar, SnackbarProps } from '@vkontakte/vkui';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';

const useSnackbar = (): [ReactNode | null, (snackbarData: SnackbarData) => void] => {
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const showSnackbar = (snackbarData: SnackbarData) => {
    setSnackbar(
      <Snackbar
        layout={snackbarData.layout || 'vertical'}
        onClose={() => setSnackbar(null)}
        before={snackbarData.icon || <Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />}
        action={snackbarData.action}
        onActionClick={snackbarData.onActionClick}
        duration={snackbarData.duration}
        style={snackbarData.style}
        subtitle={snackbarData.subtitle}
      >
        {snackbarData.title}
      </Snackbar>,
    );
  };

  return [snackbar, showSnackbar];
};

interface SnackbarData {
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

export default useSnackbar;
