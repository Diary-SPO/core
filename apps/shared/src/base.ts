export interface Person {
  // FIXME: probably should be without ?
  id?: number | bigint
  firstName: string
  lastName: string
  middleName?: string
}

export type Nullable<T> = T | null
