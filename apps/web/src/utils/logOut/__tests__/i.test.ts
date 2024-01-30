import { expect, it } from 'bun:test'
import { logOut } from '@utils'

/** logOut **/
it('должна очистить локальное хранилище', () => {
  logOut()
  expect(localStorage.length).toBe(0)
})
