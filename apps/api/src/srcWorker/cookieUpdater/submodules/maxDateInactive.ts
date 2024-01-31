export const maxDateInactive = (days: number): Date => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() - days)

  return maxDate
}
