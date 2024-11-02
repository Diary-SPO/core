import { KEY } from '@config'

export const decode = (str: string) => {
  const key_decrypt = KEY.decrypt(str)
  console.log(`Decrypt: ${str} -> ${key_decrypt}`)
  process.exit()
}
