export const getGitCommitHash = async (): Promise<string | null> => {
  let stdout
  try {
    // Крутая деструкция объекта
    ;({ stdout } = Bun.spawnSync({
      cmd: ['git', 'rev-parse', 'HEAD'],
      stdout: 'pipe'
    }))
  } catch {
    const path = './.git/refs/heads/main'
    const file = await Bun.file(path)
    if (await file.exists()) {
      stdout = await file.text()
    } else {
      return null
    }
  }

  return stdout.toString().substring(0, 7)
}
