import NodeRSA from 'node-rsa'

export const generateKeyRSA = async () => {
  const key = new NodeRSA({ b: 512 })

  const privateKey = key.exportKey('openssh-private')
  const publicKey = key.exportKey('openssh-public')

  Bun.write('openssh-private.key', privateKey)
  Bun.write('openssh-public.key', publicKey)

  return key
}
