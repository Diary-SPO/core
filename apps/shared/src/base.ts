export interface Person {
  id?: number | bigint
  firstName: string
  lastName: string
  middleName?: string
}

export type Nullable<T> = T | null

export type With<T, K> = T & K

export type DiaryUserId = number | bigint | undefined
