export const getWeekString = (startDate: Date, endDate: Date) => {
  return `
  ${startDate.getDate()}
  ${startDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}`
}
