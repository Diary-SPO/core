type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never

/**
 * Пытается выполнить функцию.
 * В случае ошибки пытается выполнить её ещё `reties - 1` количество раз.
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
  // @ts-ignore
): ReturnType<C> =>
  callback(...calbackArguments).catch(async (err: string) => {
    if (retries <= 1) throw new Error(`Ertries error: ` + err)
    await Bun.sleep(50)
    return retriesForError(callback, calbackArguments, retries - 1)
  })
