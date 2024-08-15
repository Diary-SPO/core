export const unreachable = (
  message?: string,
  options?: {
    shouldThrow?: boolean
  }
) => {
  if (options?.shouldThrow) {
    throw new Error(message ?? 'Unreachable')
  }

  console.error('[Unreachable]', message ?? 'No message')
}
