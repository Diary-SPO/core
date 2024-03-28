import { readdir } from 'node:fs/promises'

export const searchKeyRSA = async (path: string, nameSearch: string) => {
  const files = await readdir(path, { recursive: true, withFileTypes: true })
  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith(nameSearch)) {
      continue
    }
    return file
  }
}
