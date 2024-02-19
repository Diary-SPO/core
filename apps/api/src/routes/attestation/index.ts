import { Elysia } from 'elysia'
import getAttestation from './handler'


const attestation = new Elysia().get('/attestation/', getAttestation, {
  detail: {
    tags: ['Student']
  }
})

export default attestation
