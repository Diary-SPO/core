import { isAuthenticated } from '@/middlewares'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Запррещает переходить на страницу логина, если юзер авторизован
 * Запрещает не авторизованному юзеру ходить куда-либо
 */
export const beforeEach = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const isAuth = await isAuthenticated()
  const isToLogin = to.name === 'login'

  if (isAuth && isToLogin) {
    return next(false)
  }

  if (!isAuth && !isToLogin) {
    console.log('asd')
    return next({ name: 'login' })
  }

  next()
}
