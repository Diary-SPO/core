import type { App } from '../../../api/src/main.ts'

export * from './methods'
export * from './makeRequest.ts'
import { treaty } from '@elysiajs/eden'

const client = treaty<App>('localhost:3000')
const test = async (): Promise<void> => {
  const data = (await client.organization.get()).data
  if (!data) return
  // data.
}
