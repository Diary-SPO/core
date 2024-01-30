/**
 * Общий тип для записей с неизвестными значениями.
 */
export type GenericRecord = Record<string, unknown>

/**
 * Общий тип для записей с возможностью значения null.
 */
export type RecordNullable<T> = Record<string, T | null>

/**
 * Общий тип для записей без значений null.
 */
export type RecordNonNull<T> = Record<string, T>
