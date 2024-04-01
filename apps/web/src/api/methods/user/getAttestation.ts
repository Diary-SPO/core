import { api } from '../../api.ts'

export const getAttestation = async () => api.attestation[''].get()
