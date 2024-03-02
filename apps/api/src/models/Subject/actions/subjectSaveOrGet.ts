import { LogError } from 'src/LogError'
import { ISubjectModelType, SubjectModel } from '../model'

export const subjectSaveOrGet = async (subjectName: string): Promise<ISubjectModelType> =>
  SubjectModel.findOrCreate({
    where: {
      name: subjectName
    },
    defaults: {
      name: subjectName
    }
  })
    .then((v) => v[0])
    // Если ошибка - пробуем ещё раз
    .catch(async () =>
      subjectSaveOrGet(subjectName).catch(
        () => {
          throw new LogError(`Ошибка сохранения Subject`)
        }
      )
    )