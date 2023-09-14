import React from 'react';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';
import { SnackbarData } from '../hooks/useSnackbar';

export function handleResponse<T>(
  response: T,
  errorCallback: () => void,
  limitExceededCallback: () => void,
  loadingCallback: (isLoading: boolean) => void,
  showSnackbar?: (snackbarData: SnackbarData) => void,
): void {
  if (response === 418) {
    const errorIcon = React.createElement(Icon28ErrorCircleOutline, { fill: 'var(--vkui--color_icon_negative)' });
    if (showSnackbar) {
      showSnackbar({
        icon: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Сообщите нам об этом',
      });
    }
    loadingCallback(false);
    errorCallback();
    return;
  }

  if (response === 429) {
    limitExceededCallback();
    errorCallback();
    loadingCallback(false);
  }
}
