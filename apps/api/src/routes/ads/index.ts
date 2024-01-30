import { Elysia, t } from 'elysia'
import getAds from './handler'

const ads = new Elysia().get('/ads', getAds, {
  detail: {
    tags: ['Student']
  }
})

export default ads
