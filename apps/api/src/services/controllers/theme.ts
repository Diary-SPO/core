import { ThemeModel } from '../models'

export const ThemesSaveOrGet = async (
  gradebookId: number,
  themes: string[]
) => {
  const themesDB = await ThemeModel.findAll({
    where: {
      gradebookId
    }
  })

  for (const themeDB of themesDB) {
    let destroy = true
    for (const theme of themes) {
      if (theme === themeDB.description) {
        themes.splice(themes.indexOf(theme), 1)
        destroy = false
        break
      }
    }
    if (destroy) {
      themeDB.destroy()
    }
  }

  for (const theme of themes) {
    await ThemeModel.create({
      gradebookId,
      description: theme
    })
  }
}
