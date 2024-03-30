export const getWeekString = (startDate: Date, endDate: Date) => {
  return `
  ${startDate.getDate()}
  ${startDate.toLocaleString('ru-RU', { month: 'long' }).slice(0, 3)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('ru-RU', { month: 'long' }).slice(0, 3)}`
}
