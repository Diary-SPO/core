export const isDistant = (cabName: string) =>
  cabName?.toLowerCase() === 'д' ||
  cabName?.toLowerCase() === 'до' ||
  Number(cabName) === 0
