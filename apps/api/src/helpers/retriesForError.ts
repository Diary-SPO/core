//  biome-ignore lint/suspicious/noExplicitAny: несмотря на any, тут все типизировано
type ArgumentTypes<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
  //  biome-ignore lint/suspicious/noExplicitAny: несмотря на any, тут все типизировано
) => any
  ? A
  : never

/**
 * Пытается выполнить функцию.
 * В случае ошибки пытается выполнить её ещё `reties - 1` количество раз.
 * Если функция за retries количество раз не выполнилась, то возвращает ошибку.
 * @param callback
 * @param callbackArguments
 * @param retries - сколько максимум раз может быть вызван callback (включая самый первый вызов)
 * @param sleep - Величина паузы до повторного вызова callback
 * @returns
 */
//  biome-ignore lint/suspicious/noExplicitAny: несмотря на any, тут все типизировано
export const retriesForError = async <C extends (...args: any) => any>(
  callback: C,
  callbackArguments: ArgumentTypes<C>,
  retries = 2,
  sleep = 250
): Promise<ReturnType<C>> => {
  try {
    return await callback(...callbackArguments)
  } catch (err) {
    if (retries <= 1) throw new Error(`Retries error: ${err}`)
    await Bun.sleep(sleep)
    return retriesForError(callback, callbackArguments, retries - 1, sleep)
  }
}
