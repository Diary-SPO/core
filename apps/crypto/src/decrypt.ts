// import * as crypto from 'crypto'

/**
 * Расшифровывает строку с использованием алгоритма AES-256-CTR.
 * @param value - Зашифрованное значение в формате hex.
 * @param ENCRYPT_KEY - Ключ шифрования.
 * @returns Расшифрованное значение.
 */

export const decrypt = (value: string, ENCRYPT_KEY: string): string => {
  const key = Buffer.from(ENCRYPT_KEY, 'utf-8')
  const iv = Buffer.alloc(16, 0)

  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
  let decryptedValue = decipher.update(value, 'hex', 'utf-8')
  decryptedValue += decipher.final('utf-8')

  return decryptedValue
}
