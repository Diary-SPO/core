import { Elysia, t } from 'elysia'
import notificationListHandler from './handler'

const notificationsList = new Elysia().get('/notifications.list', notificationListHandler, {
  detail: {
    tags: ['Notifications']
  }
})

export default notificationsList
