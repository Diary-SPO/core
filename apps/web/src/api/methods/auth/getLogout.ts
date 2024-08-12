import { client } from '../../client.ts'

export const getLogout = async () => client.auth.logout.get()
