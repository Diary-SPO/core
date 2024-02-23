import { createHashRouter } from '@vkontakte/vk-mini-apps-router'
import { routes } from './routes.ts'

export const router = createHashRouter(routes)
