import NodeRSA from 'node-rsa'
import { generateKeyRSA } from './'
import { searchKeyRSA } from './'

const path = '..\\..\\'

const keyController = (key: NodeRSA) => {
  return {
    encrypt: (value: string) => key.encryptPrivate(value, 'base64').toString(),
    decrypt: (value: string | undefined) => {
      if (!value) return value
      return key.decryptPublic(value, 'utf8').toString()
    }
  }
}

export const rsa = async () => {
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

  console.log('Найдены ключи шифрования и будет использоваться')

  return keyController(key)
}
