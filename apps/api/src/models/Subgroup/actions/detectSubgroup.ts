export const detectSubgroup = (subjectName: string) => {
  const words = subjectName.split('/');
  if (words.length === 1) {
    return null
  }

  words.shift()

  return words.map(w => w).join('')
}