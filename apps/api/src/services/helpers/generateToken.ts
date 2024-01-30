import { API_CODES, ApiError } from '@api'
import { formatDate } from '@utils'
import { suid } from 'rand-token'
import { AuthModel } from '../models'

/**
 * Генерирует токен и вставляет в базу
 * В случае успеха возвращает токен, иначе выбрасывает ошибку
 * @param idDiaryUser
 * @returns {string} token
 */
export const generateToken = async (idDiaryUser: number): Promise<string> => {
  // Генерируем токен
  const token = suid(16)

  const formattedDate = formatDate(new Date().toISOString())

  await AuthModel.create({
    idDiaryUser,
    token,
    lastUsedDate: formattedDate
  }).catch(() => {
    throw new ApiError('Error insert token!', API_CODES.INTERNAL_SERVER_ERROR)
  })

  return token
}
