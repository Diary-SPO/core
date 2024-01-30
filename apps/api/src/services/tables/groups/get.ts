import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { Group } from '@diary-spo/types'

export const getGroupInfo = async (groupId: number): Promise<Group | null> =>
  createQueryBuilder<Group>(client)
    .select('*')
    .from('groups')
    .where(`id = ${Number(groupId)}`)
    .first()
