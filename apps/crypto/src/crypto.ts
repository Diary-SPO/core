import * as crypto from 'node:crypto'

/**
 * Шифрует строку с использованием алгоритма AES-256-CTR.
 * @param value - Значение для шифрования.
 * @param ENCRYPT_KEY - Ключ шифрования.
 * @returns Зашифрованное значение в формате hex.
 */

export const encrypt = (value: string, ENCRYPT_KEY: string): string => {
  const key = Buffer.from(ENCRYPT_KEY, 'utf-8')
  const iv = Buffer.alloc(16, 0)

  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
  let encryptedValue = cipher.update(value, 'utf-8', 'hex')
  encryptedValue += cipher.final('hex')

  return encryptedValue
}

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
