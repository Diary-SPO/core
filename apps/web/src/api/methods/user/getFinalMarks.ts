import { client } from '../../client.ts'

export const getFinalMarks = async () => client.finalMarks.get()
