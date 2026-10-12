export interface RunnerKeyValueStore {
  get(key: string): { value: string | null } | null
}

export const getRunnerStoredValue = (
  storage: RunnerKeyValueStore,
  key: string
): string | null => storage.get(key)?.value ?? null
