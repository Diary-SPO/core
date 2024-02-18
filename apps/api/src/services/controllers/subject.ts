import { SubjectModel } from "../models/subject"

export const SubjectSaveOrGet = async (subjectName: string) => {
  const [record] = await SubjectModel.findOrCreate({
    where: {
      name: subjectName
    },
    defaults: {
      name: subjectName
    }
  }).catch(() => {
    throw new Error(`[${new Date().toISOString()}] => Ошибка сохранения Subject. Входные данные: ${JSON.stringify(subjectName)}`)
  })

  return record
}