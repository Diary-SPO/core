import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { type ReactNode, useLayoutEffect, useState } from 'react'

import { ScreenSpinner } from '@vkontakte/vkui'
import { LoginForm } from '../../pages'
import { MAIN_SETTINGS } from '../routes'

// @TODO: refactor this
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { view: activeView, panel } = useActiveVkuiLocation()

  const [isLoginAllowed, setIsLoginAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
  useLayoutEffect(() => {
    const cookieValue = localStorage.getItem('token')

    const onRoute = () => {
      setIsLoginAllowed(false)
      setIsLoading(true)

      try {
        if (!cookieValue) {
          setIsLoginAllowed(false)
          return
        }

        if (panel === MAIN_SETTINGS) {
          setIsLoginAllowed(true)
          return
        }

        setIsLoginAllowed(true)
      } finally {
        setIsLoading(false)
      }

      return
    }

    onRoute()
  }, [activeView, panel])

  if (isLoading) {
    return <ScreenSpinner />
  }

  if (!isLoginAllowed) {
    return <LoginForm id={MAIN_SETTINGS} />
  }

  return children
}

export default AuthProvider
