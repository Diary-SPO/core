type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never

/**
 * Пытается выполнить функцию.
 * В случае ошибки пытается выполнить её ещё reties количество раз.
 * Если функция за retries количество раз не выполнилась, то возвращает ошибку.
 * @param callback
 * @param calbackArguments
 * @param retries
 * @returns
 */
export const retriesForError = async <C extends Function>(
  callback: C,
  calbackArguments: ArgumentTypes<C>,
  retries = 2
): Promise<ReturnType<C>> =>
  callback(...calbackArguments).catch(async (err: string) => {
    if (retries <= 0) throw new Error(err)
    await Bun.sleep(50)
    return await retriesForError(callback, calbackArguments, retries - 1)
  })
