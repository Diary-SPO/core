console.log('===============', 'Worker running!', '===============')

import { error } from '@utils'
import { sleep } from 'bun'
import { cookieUpdater } from './worker/cookieUpdater'

async function runWorker(): Promise<void> {
  while (true) {
    try {
      await Promise.all([cookieUpdater()])
      await sleep(1000) // разгружаем немного
    } catch (e) {
      error('Error at worker', e)
      break
    }
  }
}

runWorker().catch((error) => console.error(error))
