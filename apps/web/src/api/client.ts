import type { App } from '@diary-spo/api/src/main.ts'
import { treaty } from '@elysiajs/eden'

export const client = treaty<App>('localhost:3000')
