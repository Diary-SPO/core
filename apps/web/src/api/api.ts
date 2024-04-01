import { treaty } from '@elysiajs/eden'

import { SERVER_URL } from '@config'

import type { App } from '../../../api/src/main.ts'

export const api = treaty<App>(SERVER_URL)
