import { MarkValueModel } from '../../model'

export const markValueGetById = async (markValueId: number) =>
  MarkValueModel.findOne({
    where: {
      id: markValueId
    }
  })
