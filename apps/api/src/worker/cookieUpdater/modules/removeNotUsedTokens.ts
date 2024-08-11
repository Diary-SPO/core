import { formatDate } from '@utils'
import { Op } from 'sequelize'
import { AuthModel } from '../../../models/Auth'
import { MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS } from '../config'
import { maxDateInactive } from '../submodules/maxDateInactive'

export const removeNotUsedTokens = async (): Promise<void> => {
  const tokens = await AuthModel.findAll({
    where: {
      lastUsedDate: {
        [Op.lt]: formatDate(
          maxDateInactive(MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS).toISOString()
        )
      }
    }
  })

  // Удаляем старые неактивные токены
  if (!tokens) {
    return
  }

  for (let i = 0; i < tokens?.length; i++) {
    await tokens[i]
      .destroy()
      .then(() => {
        console.log(`Успешно удалил токен: ${tokens[i].token}`)
      })
      .catch(() => {
        console.error(`Ошибка удаления токена: ${tokens[i].token}`)
      })
  }
}
