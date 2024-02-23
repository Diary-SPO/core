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

  const localCopyThemes = Array.from(themes)

  for (const themeDB of themesDB) {
    let destroy = true
    for (const theme of localCopyThemes) {
      if (theme == themeDB.description) {
        localCopyThemes.splice(localCopyThemes.indexOf(theme), 1)
        destroy = false
        break
      }
    }
    if (destroy) {
      themeDB.destroy()
    }
  }

  for (const theme of localCopyThemes) {
    await ThemeModel.create({
      gradebookId,
      description: theme
    })
  }
}
