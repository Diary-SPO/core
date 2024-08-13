import { client } from '../../client.ts'

export const getPerformance = async () => client.performanceCurrent.get()
