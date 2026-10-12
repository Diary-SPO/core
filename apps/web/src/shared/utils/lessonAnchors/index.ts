export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const dayAnchorId = (dateISO: string): string => `day-${dateISO}`

export const lessonAnchorId = (dateISO: string, lessonIndex: number): string =>
  `lesson-${dateISO}-${lessonIndex}`
