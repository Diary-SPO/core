import { Elysia } from 'elysia'
import getOrganization from './handler'

const organization = new Elysia().get('/organization', getOrganization, {
  detail: {
    tags: ['Student']
  }
})

export default organization
