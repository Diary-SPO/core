import { Op } from 'sequelize'
import { ThemeModel } from '../../model'

export const deleteThemes = async (themes: string[], scheduleId: bigint) =>
  ThemeModel.destroy({
    where: {
      [Op.and]: [
        {
          scheduleId
        },
        {
          description: {
            [Op.notIn]: themes
          }
        }
      ]
    }
  })
