import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import getAttestation from './handler'

export const AttestationController = new Elysia().use(AuthPlugin).get(
  '/attestation',
  ({
    Auth: {
      user: { token }
    }
  }) => getAttestation({ token }),
  {
    detail: {
      tags: ['Student']
    }
  }
)
