const path = import.meta.filename.split('src')[0] + 'src/uploads/avatars/'

export const getStaticFile = async (filename: string): Promise<any> => {
  const file = Bun.file(path + filename)

  if (!await file.exists())
    return 'NOT_FOUND'

  return file
}
