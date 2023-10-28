export const formatLessonDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return date.toLocaleDateString(undefined, options);
}

export function getDayOfWeek(date: Date) {
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return daysOfWeek[date.getDay()]
}
