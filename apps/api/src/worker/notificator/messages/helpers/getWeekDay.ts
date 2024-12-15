const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

export const getWeekDay = (date: Date) => days[date.getDay()]
