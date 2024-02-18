type value = {[key: string]: any}
export const checkSameKeys = <A extends value, E extends value>(actualData: A, expectedData: E): boolean => {
  for (const k in Object.keys(actualData)) {
    const key = k.toString()
    if (actualData?.[key] !== expectedData?.[key]) {
      return false;
    }
  }
  return true
}