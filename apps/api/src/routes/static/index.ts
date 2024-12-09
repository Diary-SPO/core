import { Elysia, t } from 'elysia'
import {getStaticFile} from './handler'

export const StaticController = new Elysia()
	.get(
	'/uploads/avatars/:filename',
	({
		params: {
			filename
		}
	 }) => getStaticFile(filename),
	{
		detail: {
			tags: ['Current Performance']
		},
		params: t.Object({
			filename: t.String()
		})
	}
)
