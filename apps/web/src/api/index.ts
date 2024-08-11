import { treaty } from '@elysiajs/eden'
import type { App } from '../../../api/src/main.ts'

export * from './makeRequest.ts'
export * from './methods'

const client = treaty<App>('localhost:3000')
const test = async (): Promise<void> => {
  const data = (await client.organization.get()).data
  if (!data) return
  // data.
}
test()
