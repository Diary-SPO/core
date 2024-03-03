import { ThemeModel } from '@models'
import { Op } from 'sequelize'

export const deleteThemesNotIn = async (themes: string[], scheduleId: number) =>
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
