import { Elysia } from 'elysia'
import getFinalMarks from './handler'

const finalMarks = new Elysia().get('/final.marks/', getFinalMarks, {
  detail: {
    tags: ['Student']
  }
})

export default finalMarks
