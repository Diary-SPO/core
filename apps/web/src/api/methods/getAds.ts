import { api } from '../api.ts'

export const getAds = async () => api.ads.get()
