import { generateSHA256Hash } from './generateSHA256Hash'

export const b64 = async (input: string): Promise<string> => {
  const sha256Hash = await generateSHA256Hash(input)
  return btoa(sha256Hash)
}
