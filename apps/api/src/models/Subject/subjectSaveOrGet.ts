import { SubjectModel } from './model'

export const subjectSaveOrGet = async (subjectName: string) => {
  const [record] = await SubjectModel.findOrCreate({
    where: {
      name: subjectName
    },
    defaults: {
      name: subjectName
    }
  }).catch(() => {
    throw new Error(
      `[${new Date().toISOString()}] => Ошибка сохранения Subject. Входные данные: ${JSON.stringify(
        subjectName
      )}`
    )
  })

  return record
}
