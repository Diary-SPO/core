import { logOut } from '@utils'
import { expect, it } from 'vitest'

/** logOut **/
it('должна очистить локальное хранилище', () => {
  logOut()
  expect(localStorage.length).toBe(0)
})
