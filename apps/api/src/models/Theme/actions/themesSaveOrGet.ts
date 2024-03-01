import { Op } from "sequelize"
import { ThemeModel } from "../model"
import { deleteThemesNotIn } from "./deleteNotIn"

export const themesSaveOrGet = async (themes: string[], scheduleId: number) => {
	let promises = []
	
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