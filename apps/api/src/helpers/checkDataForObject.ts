type Value = { [key: string]: unknown }

export const checkSameKeys = <A extends Value, E extends Value>(
  actualData: A,
  expectedData: E
): boolean => {
  for (const k in Object.keys(actualData)) {
    const key = k.toString()
    if (actualData?.[key] !== expectedData?.[key]) {
      return false
    }
  }
  return true
}
