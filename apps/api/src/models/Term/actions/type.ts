import type { ITermUserModel } from 'src/models/TermUser'
import type { ITermModel } from '../model'

export type UserTerm = ITermUserModel & {
  term: ITermModel
}
