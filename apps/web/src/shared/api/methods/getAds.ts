import { client } from '../client.ts'

export const getAds = async () => client.ads.get()
