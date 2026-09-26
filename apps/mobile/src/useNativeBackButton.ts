import { App } from '@capacitor/app'
import { useEffect } from 'react'

export const useNativeBackButton = (onBack: () => boolean) => {
  useEffect(() => {
    let disposed = false
    let removeListener: (() => void) | undefined

    void App.addListener('backButton', ({ canGoBack }) => {
      if (onBack()) {
        return
      }

      if (canGoBack) {
        window.history.back()
        return
      }

      void App.exitApp()
    }).then((listener) => {
      if (disposed) {
        void listener.remove()
        return
      }

      removeListener = () => {
        void listener.remove()
      }
    })

    return () => {
      disposed = true
      removeListener?.()
    }
  }, [onBack])
}
