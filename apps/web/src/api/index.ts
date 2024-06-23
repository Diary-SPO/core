import type { App } from '../../../api/src/main.ts'

export * from './methods'
export * from './makeRequest.ts'
import { treaty } from '@elysiajs/eden'

const client = treaty<App>('localhost:3000')
const test = async (): Promise<void> => {
  const data = (await client.organization.get()).data

  if (typeof data === 'string') return
}
// // response: Hi Elysia
// const { data: index } = await client.index.get()
//
// // response: 1895
// const { data: id } = await client.id({ id: 1895 }).get()

// // response: { id: 1895, name: 'Skadi' }
// const { data: nendoroid } = await client.mirror.post({
//   id: 1895,
//   name: 'Skadi'
// })

// client.
