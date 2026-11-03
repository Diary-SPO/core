export const getWeekString = (startDate: Date, endDate: Date) => {
  const startMonth = startDate
    .toLocaleString('ru-RU', { month: 'long' })
    .slice(0, 3)
  const endMonth = endDate.toLocaleString('ru-RU', { month: 'long' }).slice(0, 3)
  return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth}`
}
