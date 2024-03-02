import { ThemeModel, deleteThemesNotIn } from '@models'

export const themesSaveOrGet = async (themes: string[], scheduleId: number) => {
  const promises = []

  // Удаялем устаревшие темы
  deleteThemesNotIn(themes, scheduleId)

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
