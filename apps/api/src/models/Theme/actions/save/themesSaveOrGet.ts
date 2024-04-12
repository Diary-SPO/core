import { ThemeModel, deleteThemes } from '@models'

export const themesSaveOrGet = async (themes: string[], scheduleId: bigint) => {
  const promises = []

  // Удаялем устаревшие темы
  deleteThemes(themes, scheduleId)

  for (const theme of themes) {
    const themeToSave = {
      description: theme,
      scheduleId
    }
    const promise = await ThemeModel.findOrCreate({
      where: {
        ...themeToSave
      },
      defaults: {
        ...themeToSave
      }
    })
    promises.push(promise)
  }

  // Возвращаем актуальные темы
  return promises
}
