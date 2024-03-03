// import * as crypto from 'crypto'

export const generateSHA256Hash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)

  const buffer = await crypto.subtle.digest('SHA-256', data)

  const arrayBuffer = new Uint8Array(buffer)
  return Array.from(arrayBuffer)
    .map((byte) => String.fromCharCode(byte))
    .join('')
}
