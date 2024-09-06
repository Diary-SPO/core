import ky from 'ky'

export const fetcher = ky.extend({
  timeout: 10000 // 10 seconds
})
