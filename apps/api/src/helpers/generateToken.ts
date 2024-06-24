import { API_CODES, ApiError } from '@api'
import { formatDate } from '@utils'
import { suid } from 'rand-token'
import { AuthModel } from '../models'

/**
 * Генерирует токен и вставляет в базу
 * В случае успеха возвращает токен, иначе выбрасывает ошибку
 * @param diaryUserId
 * @returns {string} token
 */
export const generateToken = async (diaryUserId: bigint): Promise<string> => {
  // Генерируем токен
  const token = suid(16)

  const formattedDate = formatDate(new Date().toISOString())

  // TODO: сделать метод рядом с моделью для создания и использовать тут
  await AuthModel.create({
    diaryUserId,
    token,
    lastUsedDate: formattedDate
  }).catch(() => {
    throw new ApiError('Error insert token!', API_CODES.INTERNAL_SERVER_ERROR)
  })

  return token
}
