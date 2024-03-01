export const objPropertyCopy = <T extends { [k in keyof T]: T[k] }>(
  to: T,
  from: T
): T => {
  for (const key of Object.keys(from)) {
    const value = from[key as keyof T]
    Reflect.set(to, key, value)
  }
  return to
}
