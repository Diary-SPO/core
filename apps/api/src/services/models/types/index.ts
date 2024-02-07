import { Model, Optional } from 'sequelize'

export type IModelPrototype<T extends object, K extends keyof T> = Model<
  T,
  Optional<T, K>
> &
  T
