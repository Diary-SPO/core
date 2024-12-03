import {AvatarModel} from "../models/Avatar";
import {readdir} from "node:fs/promises";
import cliProgress from "cli-progress"
import {AvatarTagModel} from "../models/AvatarTag";
import {TagModel} from "../models/Tag";

const pathToDecorationsFile = 'src/uploads/decorations.json'
const pathToAvatars = 'src/uploads/avatars'

interface Content {
	avatars: AvatarContent[]
}

interface AvatarContent {
	isAnimated: boolean
	filename: string
	tags: string[]
	price: number
}

export const syncDatabaseForDecorations = async () => {
	console.log('Обновляю декорации в базе данных...')

	let progress = 0
	const progressBar = new cliProgress.SingleBar({
		format: ' {bar} | {filename} | {value}/{total}'
	}, cliProgress.Presets.shades_classic)

	const file = Bun.file(pathToDecorationsFile)

	if (!await file.exists()) {
		console.log('Файл декораций не найден. Пропускаю ...')
		return
	}

	const contents: Content = await file.json()
	const avatarFiles = await readdir(pathToAvatars)

	progressBar.start(avatarFiles.length, progress)

	for (const avatarFile of avatarFiles) {
		progressBar.increment(1, {filename: avatarFile})
		const avatarToSave = {
			filename: avatarFile,
			isAnimated: avatarFile.endsWith('.gif'),
			price: 1000
		}

		let tags: string[] = []

		// Пробуем найти, переопределена ли цена и статус анимации
		for (const avatarInfo of contents.avatars) {
			if (avatarInfo.filename !== avatarFile)
				continue
			avatarToSave.isAnimated = avatarInfo.isAnimated
			avatarToSave.price = avatarInfo.price
			tags = avatarInfo.tags
			break
		}

		// Находим или создаём модель
		const avatarModel = await AvatarModel.findOrCreate({
			where: {
				filename: avatarFile,
			},
			defaults: avatarToSave
		})

		// Проверяем наличие тегов
		if (!tags)
			await AvatarTagModel.destroy({
				where: {
					avatarId: avatarModel[0].id
				}
			})
		else
			for (const tag of tags) {
				const tagModel = await TagModel.findOrCreate({
					where: {
						value: tag
					},
					defaults: {
						value: tag
					}
				})
				await AvatarTagModel.findOrCreate({
					where: {
						avatarId: avatarModel[0].id,
						tagId: tagModel[0].id
					},
					defaults: {
						avatarId: avatarModel[0].id,
						tagId: tagModel[0].id
					}
				})
			}

		// Если создана - то завершаем цикл
		if (avatarModel[1])
			continue

		await avatarModel[0].update(avatarToSave)
	}

	progressBar.stop()

	console.log('Обновил все декорации')
}