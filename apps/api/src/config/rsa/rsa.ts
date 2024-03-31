import { KEY_SCAN_PATH } from '@config'
import NodeRSA from 'node-rsa'
import { generateKeyRSA, searchKeyRSA } from './'

const keyController = (key: NodeRSA) => {
  return {
    encrypt: (value: string) => key.encryptPrivate(value, 'base64').toString(),
    decrypt: (value: string | undefined) => {
      if (!value) return value
      return key.decryptPublic(value, 'utf8').toString()
    }
  }
}

export const rsa = async (path: string) => {
  const privateKeyFile = await searchKeyRSA(path, 'openssh-private.key')
  const publicKeyFile = await searchKeyRSA(path, 'openssh-public.key')

  if (!privateKeyFile || !publicKeyFile) {
    console.log("Ключи шифрования '.key' не найдены. Будут сгенерированы новые")
    const key = await generateKeyRSA()
    return keyController(key)
  }

  const privateKeyString = await Bun.file(path + privateKeyFile.name).text()
  const publicKeyString = await Bun.file(path + publicKeyFile.name).text()

  const key = new NodeRSA()

  key.importKey(privateKeyString, 'openssh-private')
  key.importKey(publicKeyString, 'openssh-public')

  console.log('Найдены ключи шифрования и будут использоваться')

  return keyController(key)
}
