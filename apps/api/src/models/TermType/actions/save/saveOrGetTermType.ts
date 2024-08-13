import { type ITermTypeModel, TermTypeModel } from '../../model'

export const saveOrGetTermType = async (
  name: string
): Promise<ITermTypeModel> =>
  TermTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  })
    .then((v) => v[0])
    // Если ошибка - пробуем ещё раз
    .catch(async () =>
      saveOrGetTermType(name).catch(() => {
        throw new Error('Не удалось сохранить taskType')
      })
    )
