import { ThemeModel } from '@models'
import { Op } from 'sequelize'

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
