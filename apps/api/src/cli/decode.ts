import { decrypt } from "@diary-spo/crypto"

export const decode = (str: string) => {
  const key = Bun.env.ENCRYPT_KEY

  if (!key) {
    console.log("Ключ шифрования не задан")
    return
  }

  const key_decrypt =decrypt(str, key)
  console.log(`Decrypt: ${str} -> ${key_decrypt}`)
  process.exit()
}