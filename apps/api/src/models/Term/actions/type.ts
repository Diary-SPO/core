import { ITermUserModel } from 'src/models/TermUser'
import { ITermModel } from '../model'

export type UserTerm = ITermUserModel & {
  term: ITermModel
}
