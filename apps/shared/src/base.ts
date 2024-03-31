export interface Person {
  id: number
  firstName: string
  lastName: string
  middleName?: string
}

export type Nullable<T> = T | null
