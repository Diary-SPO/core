import { client } from '../../client.ts'

export const getAttestation = async () => client.attestation.get()
