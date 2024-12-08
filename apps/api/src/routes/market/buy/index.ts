import { Elysia, t } from 'elysia'
import { AuthPlugin } from '../../../services/AuthService'
import buyAvatar from './handler'

export const BuyAvatar = new Elysia()
	.use(AuthPlugin)
	.post('/buyAvatar', ({
		Auth: {
			user: {localUserId}
		}, body: {
			avatarId
		}}) => buyAvatar(localUserId, avatarId), {
		detail: {
			tags: ['market']
		},
		body: t.Object({
			avatarId: t.String()
		})
	})
